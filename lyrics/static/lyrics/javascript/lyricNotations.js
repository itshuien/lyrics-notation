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

document.addEventListener('DOMContentLoaded', () => {
  loadLyricNotations(lyricNotations); // parameter is declared in template
})
