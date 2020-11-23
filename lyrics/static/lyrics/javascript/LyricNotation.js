class LyricNotation extends Notation {
  constructor(id, lyricId, selectedText, content, position) {
    super(id, lyricId, selectedText, content, position);
  }

  static notationType = 'lyric';

  highlight() {
    const { startLine, endLine } = this.position;
    
    for (let lineNumber = startLine; lineNumber <= endLine; lineNumber++) {
      const { startWord, endWord } = this.getStartAndEndWord(lineNumber);
      if (startWord && endWord) {
        this.highlightPart(startWord, endWord);
      }
    }
  }

  highlightPart(startWord, endWord) {
    const range = new Range();
    range.setStart(startWord.previousSibling, 0);
    range.setEnd(endWord.nextSibling, endWord.textContent.length);

    const wrapper = this.buildWrapper();
    if (startWord == endWord) {
      range.selectNode(startWord);
      range.surroundContents(wrapper);
    } else {
      wrapper.appendChild(range.extractContents());
      range.insertNode(wrapper);
    }
  }

  getStartAndEndWord(lineNumber) {
    const lineElement = document.querySelector(`[data-line-id="${lineNumber}"]`);
    const wordElements = this.getWordElementsInLine(lineElement);
    const lastWordElement = wordElements.slice(-1)[0];

    if (!wordElements.length) return { startWord: null, endWord: null };

    const lineStartOffset = lineNumber == this.position.startLine ? this.position.startOffset : 0;
    const lineEndOffset = lineNumber == this.position.endLine ? this.position.endOffset : parseInt(lastWordElement.dataset.charOffset) + lastWordElement.textContent.toString().length;

    let startWord, endWord;

    for (let wordElement of wordElements) {
      if (startWord && endWord) break;

      const wordCharOffset = parseInt(wordElement.dataset.charOffset);
      const wordLength = wordElement.textContent.length + wordCharOffset;

      if (!startWord && lineStartOffset >= wordCharOffset && lineStartOffset < wordLength) startWord = wordElement;
      if (!endWord && lineEndOffset > wordCharOffset && lineEndOffset <= wordLength) endWord = wordElement;
    }

    return { startWord, endWord }
  }

  getWordElementsInLine(lineElement) {
    const children = Array.from(lineElement.children);
    return children.filter(child => child.dataset.wordId);
  }

  buildWrapper() {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-notation-id', this.id);
    wrapper.classList.add('lyric-notation');
    this.addHoverEffect(wrapper);
    this.addClickListener(wrapper);
    return wrapper;
  }

  addHoverEffect(wrapper) {
    wrapper.addEventListener('mouseover', () => {
      if (wrapper.classList.contains('lyric-notation-hidden')) return;
      const peers = document.querySelectorAll(`.lyric-notation[data-notation-id="${this.id}"]`);
      for (let peer of peers) peer.classList.add('lyric-notation-focus');
    });
  
    wrapper.addEventListener('mouseout', () => {
      if (wrapper.classList.contains('lyric-notation-hidden')) return;
      const peers = document.querySelectorAll(`.lyric-notation[data-notation-id="${this.id}"]`);
      for (let peer of peers) peer.classList.remove('lyric-notation-focus');
    });
  }

  addClickListener(wrapper) {
    wrapper.addEventListener('click', () => {
      if (wrapper.classList.contains('lyric-notation-hidden')) return;
      PhoneticNotation.hideAllCards();
      LyricNotation.hideAllCards();
      LyricNotation.getCard(this.id).classList.remove('d-none');
    })
  }
}