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

  for (let lyricLine of lyricContainer.children) {
    lyricLine.setAttribute('y', lyricLineHeight);
    lyricLineHeight += 30;

    let x = 0;
    let charOffset = 0;

    for (let word of Array.from(lyricLine.children).filter(child => child.dataset.wordId)) {
      word.setAttribute('x', x);
      word.setAttribute('data-start-offset', charOffset)
      word.setAttribute('data-end-offset', charOffset + word.textContent.length)
      x += word.getBBox().width + 2;
      charOffset += word.textContent.length;
    }
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

const drawLyricNotation = (width, x) => {
  const rectHtml = `<rect width="${width}" height="100%" x="${x}" class="rectNotation"></rect>`;
  return rectHtml;
}

const loadLyricNotations2 = lyricNotations => {
  for (let notation of lyricNotations) {
    const { start_line: startLine, start_offset: startOffset, end_line: endLine, end_offset: endOffset } = notation;
  
    for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
      const lineElement = document.querySelector(`[data-line-id="${lineNumber}"]`);
  
      const lineStartOffset = lineNumber == startLine ? startOffset : 0;
      const lineEndOffset = lineNumber == endLine ? endOffset : parseInt(lineElement.lastElementChild.dataset.startOffset) + lineElement.lastElementChild.textContent.toString().length;

      let startWord, endWord;

      for (let wordElement of lineElement.children) {
        if (startWord && endWord) break;

        if (!startWord && lineStartOffset >= wordElement.dataset.startOffset && lineStartOffset < wordElement.dataset.endOffset) {
          startWord = wordElement;
        }
        if (!endWord && lineEndOffset > wordElement.dataset.startOffset && lineEndOffset <= wordElement.dataset.endOffset) {
          endWord = wordElement;
        }
      }
      
      if (!startWord || !endWord) continue;

      const startPosition = startWord.getStartPositionOfChar(lineStartOffset - parseInt(startWord.dataset.startOffset)).x;
      const endPosition = endWord.getEndPositionOfChar(lineEndOffset - parseInt(endWord.dataset.startOffset) - 1).x;
      const rect = drawLyricNotation((endPosition - startPosition), startPosition)
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
    const { baseNode, extentNode } = selection;

    const range = new Range();
    range.setStart(baseNode.parentNode.firstChild, 0);
    range.setEnd(extentNode.parentNode.firstChild, extentNode.textContent.length);

    selection.removeAllRanges();
    selection.addRange(range);
  })
}
