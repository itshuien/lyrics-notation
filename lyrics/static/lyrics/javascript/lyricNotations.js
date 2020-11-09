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
  
      addNotationWrapper(lineElement.firstChild, lineStartOffset, lineEndOffset, notation.id);
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
    let lineOffset = 0;

    for (let word of Array.from(lyricLine.children).filter(child => child.dataset.wordId)) {
      word.setAttribute('x', x);
      word.setAttribute('data-line-offset', lineOffset)
      x += word.getBBox().width;
      lineOffset += word.textContent.length;
    }
  }
  lyricContainer.style.height = lyricLineHeight;
}

document.addEventListener('DOMContentLoaded', () => {
  loadLyricNotations(lyricNotations); // parameter is declared in template
  loadTokenizedLyrics();
})
