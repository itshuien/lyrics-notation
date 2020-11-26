function applyMagneticSelectionOnMouseUp(container) {
  container.addEventListener('mouseup', event => {
    const activeViewMode = document.querySelector(`#lyric-view-mode-dropdown .active[data-view-mode]`).dataset.viewMode;
    if (activeViewMode == 'view') return;

    if (event.target.dataset.notationId) return;

    const { startNode, endNode } = getSelectionDetails();
    const range = new Range();
    range.setStart(startNode.firstChild.firstChild, 0);
    range.setEnd(endNode.firstChild.firstChild, endNode.firstChild.textContent.length);
    
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);

    handleSelection();
  })
}

function handleSelection() {
  const lyricNotationButton = document.getElementById('lyric-notation-tool');
  const phoneticNotationButton = document.getElementById('phonetic-notation-tool');

  const isOnlyOneWordSelected = window.getSelection().anchorNode == window.getSelection().focusNode;
  const wordHasPhoneticNotation = window.getSelection().anchorNode.parentNode?.querySelector('rt');
  phoneticNotationButton.disabled = isOnlyOneWordSelected ? wordHasPhoneticNotation : true;

  if (isOverlappingWithExistingLyricNotations()) {
    lyricNotationButton.disabled = true;
  } else {
    LyricNotation.hideAllCards();
    PhoneticNotation.hideAllCards();
    lyricNotationButton.disabled = false;
  }
}

function getSelectionDetails() {
  const { startNode, endNode } = getSelectionNodes();
  const { startOffsetByLine, endOffsetByLine } = getOffsetsByLine(startNode, endNode);
  const { startOffsetByLyric, endOffsetByLyric } = getOffsetsByLyric(startNode, endNode, startOffsetByLine, endOffsetByLine);

  const startLine = parseInt(startNode.closest('[data-line-id]').dataset?.lineId);
  const endLine = parseInt(endNode.closest('[data-line-id]').dataset?.lineId);
  const selectedLines = getSelectedLines(startLine, endLine, startOffsetByLine, endOffsetByLine);

  return {
    startLine, endLine,
    startOffsetByLine, endOffsetByLine,
    startOffsetByLyric, endOffsetByLyric,
    startNode, endNode,
    text: selectedLines.join(`\n`),
  };
}

function getSelectionNodes() {
  let { anchorNode, focusNode, anchorOffset, focusOffset } = window.getSelection();

  if (anchorNode.classList?.contains('lyric-line')) anchorNode = getLastWordInLine(anchorNode);
  else if (['RT', 'RB'].includes(anchorNode.tagName) || anchorNode.nodeType === Node.TEXT_NODE) anchorNode = anchorNode.parentNode.closest('ruby');

  if (focusNode.classList?.contains('lyric-line')) focusNode = getLastWordInLine(focusNode);
  else if (['RT', 'RB'].includes(focusNode.tagName) || focusNode.nodeType === Node.TEXT_NODE) focusNode = focusNode.parentNode.closest('ruby');

  if (isSelectionReversed(anchorNode, focusNode, anchorOffset, focusOffset)) {
    [anchorNode, focusNode] = [focusNode, anchorNode];
  }

  return { startNode: anchorNode, endNode: focusNode }
}

function getOffsetsByLine(startNode, endNode) {
  let startOffsetByLine = parseInt(startNode.dataset.charOffset);
  let endOffsetByLine = endNode.textContent.length + parseInt(endNode.dataset.charOffset);
  return { startOffsetByLine, endOffsetByLine }
}

function getOffsetsByLyric(startNode, endNode, startOffsetByLine, endOffsetByLine) {
  let startOffsetByLyric = parseInt(startNode.closest('[data-line-id]').dataset.charOffset) + startOffsetByLine;
  let endOffsetByLyric = parseInt(endNode.closest('[data-line-id]').dataset.charOffset) + endOffsetByLine;
  return { startOffsetByLyric, endOffsetByLyric }
}

function isSelectionReversed(anchorNode, focusNode, anchorOffset, focusOffset) {
  const position = anchorNode.compareDocumentPosition(focusNode);
  const isReversed = !position && anchorOffset > focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING;
  return isReversed;
}

function getLastWordInLine(line) {
  const words = line.querySelectorAll('ruby').length ? line.querySelectorAll('ruby') : line.previousElementSibling.querySelectorAll('ruby');
  return words[words.length-1];
}

function getSelectedLines(startLine, endLine, startOffsetByLine, endOffsetByLine) {
  const selectedLines = lyricLines.slice(startLine, endLine+1);
  if (startLine == endLine) {
    selectedLines[0] = lyricLines[startLine].slice(startOffsetByLine, endOffsetByLine);
  } else {
    selectedLines[0] = lyricLines[startLine].slice(startOffsetByLine);
    selectedLines[selectedLines.length-1] = lyricLines[endLine].slice(0, endOffsetByLine);
  }
  return selectedLines;
}

function isOverlappingWithExistingLyricNotations() {
  const selection = getSelectionDetails();

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
    event.clipboardData.setData('text/plain', getSelectionDetails().text);
    event.preventDefault();
  });
}
