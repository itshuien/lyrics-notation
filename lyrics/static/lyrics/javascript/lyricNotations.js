const getNotationWrapper = (notationId) => {
  const wrapperElement = document.createElement('span');
  wrapperElement.dataset.notationId = notationId;
  wrapperElement.classList.add('notation-wrapper');
  return wrapperElement;
}

const addNotationWrapper = (node, startOffset, endOffset, notationId) => {
  const range = document.createRange();
  range.setStart(node, startOffset);
  range.setEnd(node, endOffset);
  range.surroundContents(getNotationWrapper(notationId));
}

const loadLyricNotations = lyricNotations => {
  for (let notation of lyricNotations) {
    const {
      start_line: startLine,
      start_offset: startOffset,
      end_line: endLine,
      end_offset: endOffset
    } = notation;
  
    for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
      const lineElement = document.getElementById(`line${lineNumber}`);
  
      const lineStartOffset = lineNumber == startLine ? startOffset : 0;
      const lineEndOffset = lineNumber == endLine ? endOffset : lineElement.textContent.length;
  
      if (lineElement.textContent) addNotationWrapper(lineElement.firstChild, lineStartOffset, lineEndOffset, notation.id);
    }
  }
}

const loadTokenizedLyrics = () => {
  const lyricContainer = document.getElementById('lyricContainer');
  let lyricLineHeight = 0;
  let lineCharOffset = 0;

  for (let lyricLine of lyricContainer.children) {
    lyricLine.setAttribute('y', lyricLineHeight);
    lyricLine.setAttribute('data-char-offset', lineCharOffset)
    lyricLineHeight += 30;

    let x = 0;
    let wordCharOffset = 0;

    for (let word of Array.from(lyricLine.children).filter(child => child.dataset.wordId)) {
      word.setAttribute('x', x);
      word.setAttribute('data-char-offset', wordCharOffset)
      x += word.getBBox().width + 2;
      wordCharOffset += word.textContent.length;
    }
    lineCharOffset += wordCharOffset;
  }
  lyricContainer.style.height = lyricLineHeight;
  lyricContainer.style.display = '';
}

document.addEventListener('DOMContentLoaded', () => {
  loadLyricNotations(lyricNotations); // parameter is declared in template
  loadTokenizedLyrics();
  overrideCopyBehaviour();
  magneticSelectionOnMouseUp();

  document.getElementById('lyric').style.display = 'none';

  const lyricModeSwitch = document.getElementById('lyricModeSwitch');
  lyricModeSwitch.addEventListener('click', () => {
    const tokenizedLyricContainer = document.getElementById('lyricContainer');
    const defaultLyricContainer = document.getElementById('lyric');

    if (tokenizedLyricContainer.style.display == 'none') {
      tokenizedLyricContainer.style.display = '';
      defaultLyricContainer.style.display = 'none';
    } else {
      tokenizedLyricContainer.style.display = 'none';
      defaultLyricContainer.style.display = '';
    }
  })

  loadLyricNotations2(lyricNotations);
})

const drawLyricNotation = (line, startWord, endWord, width, x) => {
  const rectHtml = `<rect data-line-id="${line}" data-first-word="${startWord}" data-last-word="${endWord}"  width="${width}" height="100%" x="${x}" class="rectNotation"></rect>`;
  return rectHtml;
}

const loadLyricNotations2 = lyricNotations => {
  for (let notation of lyricNotations) {
    const { start_line: startLine, start_offset: startOffset, end_line: endLine, end_offset: endOffset } = notation;
  
    for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
      const lineElement = document.querySelector(`[data-line-id="${lineNumber}"]`);
  
      const lineStartOffset = lineNumber == startLine ? startOffset : 0;
      const lineEndOffset = lineNumber == endLine ? endOffset : parseInt(lineElement.lastElementChild.dataset.charOffset) + lineElement.lastElementChild.textContent.toString().length;

      let startWord, endWord;

      for (let wordElement of lineElement.children) {
        if (startWord && endWord) break;

        const wordCharOffset = parseInt(wordElement.dataset.charOffset);
        const wordLength = wordElement.textContent.length + wordCharOffset;

        if (!startWord && lineStartOffset >= wordCharOffset && lineStartOffset < wordLength) {
          startWord = wordElement;
        }
        if (!endWord && lineEndOffset > wordCharOffset && lineEndOffset <= wordLength) {
          endWord = wordElement;
        }
      }
      
      if (!startWord || !endWord) continue;

      const startPosition = startWord.getStartPositionOfChar(lineStartOffset - parseInt(startWord.dataset.charOffset)).x;
      const endPosition = endWord.getEndPositionOfChar(lineEndOffset - parseInt(endWord.dataset.charOffset) - 1).x;
      const rect = drawLyricNotation(lineNumber, startWord.dataset.wordId, endWord.dataset.wordId, (endPosition - startPosition), startPosition)
      lineElement.insertAdjacentHTML('afterbegin', rect);
    }
  }
}

const overrideCopyBehaviour = () => {
  document.addEventListener('copy', function(e){
    var text = window.getSelection().toString().replace(/[\n\r]+/g, '');
    e.clipboardData.setData('text/plain', text);
    e.preventDefault();
  });
}

const magneticSelectionOnMouseUp = () => {
  const lyricContainer = document.getElementById('lyricContainer');
  
  lyricContainer.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    const { startNode, endNode } = getSelectionDetails();

    const range = new Range();
    range.setStart(startNode.firstChild, 0);
    range.setEnd(endNode.firstChild, endNode.textContent.length);

    selection.removeAllRanges();
    selection.addRange(range);

    console.log(`Overlapping: ${isOverlappingWithExistingNotations()}`)
  })
}

const getSelectionNodes = () => {
  let { baseNode, extentNode } = window.getSelection();

  baseNode = baseNode.parentNode.dataset.lineId ? baseNode : baseNode.parentNode;
  extentNode = extentNode.parentNode.dataset.lineId ? extentNode : extentNode.parentNode;

  return { baseNode, extentNode }
}

const getSelectionDetails = () => {
  let { baseNode, extentNode } = getSelectionNodes();

  let startCharOffset = parseInt(baseNode.parentNode?.dataset?.charOffset) + parseInt(baseNode.dataset?.charOffset);
  let endCharOffset = parseInt(extentNode.parentNode?.dataset?.charOffset) + parseInt(extentNode.textContent?.length - extentNode.dataset?.charOffset);

  if (startCharOffset > endCharOffset) {
    [startCharOffset, endCharOffset] = [endCharOffset, startCharOffset];
    [baseNode, extentNode] = [extentNode, baseNode];
  }

  return { startNode: baseNode, endNode: extentNode, startCharOffset, endCharOffset };
}

const isOverlappingWithExistingNotations = () => {
  const selection = getSelectionDetails();

  const start1 = selection.startCharOffset;
  const end1 = selection.endCharOffset;

  for (let notation of lyricNotations) {
    const start2 = parseInt(document.querySelector(`[data-line-id="${notation.start_line}"]`).dataset.charOffset) + notation.start_offset;
    const end2 = parseInt(document.querySelector(`[data-line-id="${notation.end_line}"]`).dataset.charOffset) + notation.end_offset;

    if ((start1 <= start2 && end1 >= end2 ||
    start1 >= start2 && end1 <= end2 ||
    start1 >= start2 && start1 < end2 ||
    end1 <= end2 && end1 > start2)) return true;
  };

  return false;
}
