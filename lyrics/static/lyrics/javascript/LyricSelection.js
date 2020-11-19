/* TODO: Handle text selection error */
function applyMagneticSelectionOnMouseUp(container) {
  container.addEventListener('mouseup', event => {
    const selection = window.getSelection();

    if (event.target.dataset.notationId) return;

    const { startNode, endNode } = this.getSelectionDetails();

    const range = new Range();
    range.setStart(startNode.firstChild, 0);
    range.setEnd(endNode.firstChild, endNode.textContent.length);

    selection.removeAllRanges();
    selection.addRange(range);

    this.handleSelection();
  })
}

function handleSelection() {
  const lyricNotationButton = document.getElementById('lyric-notation-tool');
  const phoneticNotationButton = document.getElementById('phonetic-notation-tool');

  const isOnlyOneWordSelected = window.getSelection().baseNode == window.getSelection().extentNode;
  const wordHasPhoneticNotation = window.getSelection().baseNode.parentNode?.querySelector('rt');
  phoneticNotationButton.disabled = isOnlyOneWordSelected ? wordHasPhoneticNotation : true;

  if (this.isOverlappingWithExistingLyricNotations()) {
    lyricNotationButton.disabled = true;
  } else {
    LyricNotation.hideAllCards();
    PhoneticNotation.hideAllCards();
    lyricNotationButton.disabled = false;
  }
}

function getSelectionDetails() {
  let { baseNode, extentNode } = window.getSelection();

  baseNode = baseNode.parentNode?.dataset?.wordId ? baseNode.parentNode : baseNode;
  extentNode = extentNode.parentNode?.dataset?.wordId ? extentNode.parentNode : extentNode;

  let startOffsetByLine = parseInt(baseNode.dataset?.charOffset);
  let endOffsetByLine = extentNode.textContent?.length + parseInt(extentNode.dataset?.charOffset);

  let startOffsetByLyric = parseInt(baseNode.closest('[data-line-id]').dataset?.charOffset) + startOffsetByLine;
  let endOffsetByLyric = parseInt(extentNode.closest('[data-line-id]').dataset?.charOffset) + endOffsetByLine;

  if (startOffsetByLyric > endOffsetByLyric) {
    [startOffsetByLyric, endOffsetByLyric] = [endOffsetByLyric, startOffsetByLyric];
    [baseNode, extentNode] = [extentNode, baseNode];
    [startOffsetByLine, endOffsetByLine] = [endOffsetByLine, startOffsetByLine];
  }

  const startLine = parseInt(baseNode.closest('[data-line-id]').dataset?.lineId);
  const endLine = parseInt(extentNode.closest('[data-line-id]').dataset?.lineId);

  const selectedLines = lyricLines.slice(startLine, endLine+1);
  if (startLine == endLine) {
    selectedLines[0] = lyricLines[startLine].slice(startOffsetByLine, endOffsetByLine);
  } else {
    selectedLines[0] = lyricLines[startLine].slice(startOffsetByLine);
    selectedLines[selectedLines.length-1] = lyricLines[endLine].slice(0, endOffsetByLine);
  }

  return {
    startLine, endLine,
    startOffsetByLine, endOffsetByLine,
    startOffsetByLyric, endOffsetByLyric,
    startNode: baseNode,
    endNode: extentNode,
    text: selectedLines.join(`\n`),
  };
}

function isOverlappingWithExistingLyricNotations() {
  const selection = this.getSelectionDetails();

  const start1 = selection.startOffsetByLyric;
  const end1 = selection.endOffsetByLyric;

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

function overrideCopyBehaviour(container) {
  container.addEventListener('copy', event => {
    event.clipboardData.setData('text/plain', this.getSelectionDetails().text);
    event.preventDefault();
  });
}
