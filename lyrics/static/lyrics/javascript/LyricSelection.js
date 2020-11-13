class LyricSelection {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.applyMagneticSelectionOnMouseUp();
    this.overrideCopyBehaviour();
  }

  applyMagneticSelectionOnMouseUp() {
    this.container.addEventListener('mouseup', event => {
      const selection = window.getSelection();

      if (event.target.dataset.notationId) {
        // resetSelectedText();
        return;
      };

      const { startNode, endNode } = this.getSelectionDetails();

      const range = new Range();
      range.setStart(startNode.firstChild, 0);
      range.setEnd(endNode.firstChild, endNode.textContent.length);

      selection.removeAllRanges();
      selection.addRange(range);

      const isInvalid = this.isOverlappingWithExistingNotations();
      // console.log(`Overlapping: ${isInvalid}`)
      if (!isInvalid) {
        this.getSelectedText();
        document.getElementById('lyricNotationForm').classList.remove('d-none');
        document.getElementById('lyricNotationContent').classList.add('d-none');
      }
    })
  }

  getSelectionDetails() {
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
  
    return {
      startLine: parseInt(baseNode.parentNode.dataset.lineId),
      endLine: parseInt(extentNode.parentNode.dataset.lineId),
      startOffsetByLine,
      endOffsetByLine,
      startNode: baseNode,
      endNode: extentNode,
      startOffsetByLyric,
      endOffsetByLyric
    };
  }

  isOverlappingWithExistingNotations() {
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

  getSelectedText() {
    const { startLine, endLine, startOffsetByLine, endOffsetByLine } = this.getSelectionDetails();
    const selectedLines = lyricLines.slice(startLine, endLine+1);
  
    if (startLine == endLine) {
      selectedLines[0] = lyricLines[startLine].slice(startOffsetByLine, endOffsetByLine);
    } else {
      selectedLines[0] = lyricLines[startLine].slice(startOffsetByLine);
      selectedLines[selectedLines.length-1] = lyricLines[endLine].slice(0, endOffsetByLine);
    }
  
    const selectedTextInput = document.getElementById('selectedText');
    selectedTextInput.value = selectedLines.join(`\n`);
  
    document.getElementById('startLine').value = startLine
    document.getElementById('startOffset').value = startOffsetByLine
    document.getElementById('endLine').value = endLine
    document.getElementById('endOffset').value = endOffsetByLine
  
    return selectedLines.join(`\n`);
  }

  overrideCopyBehaviour() {
    this.container.addEventListener('copy', event => {
      event.clipboardData.setData('text/plain', this.getSelectedText());
      event.preventDefault();
    });
  }

  resetSelectedText() {
    window.getSelection().removeAllRanges();
    document.getElementById('selectedText').value = '';
    document.getElementById('startLine').value = '';
    document.getElementById('startOffset').value = '';
    document.getElementById('endLine').value = '';
    document.getElementById('endOffset').value = '';
  }
}