class LyricNotation {
  constructor(id, lyricId, selectedText, content, position) {
    this.id = id;
    this.lyricId = lyricId;
    this.selectedText = selectedText;
    this.content = content;
    this.position = position;
  }

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
    range.setStart(startWord.firstChild, 0);
    range.setEnd(endWord.firstChild, endWord.textContent.length);

    const wrapper = this.buildWrapper();
    wrapper.appendChild(range.extractContents());

    range.insertNode(wrapper);
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
      const peers = document.querySelectorAll(`[data-notation-id="${this.id}"]`);
      for (let peer of peers) peer.classList.add('lyric-notation-focus');
    });
  
    wrapper.addEventListener('mouseout', () => {
      const peers = document.querySelectorAll(`[data-notation-id="${this.id}"]`);
      for (let peer of peers) peer.classList.remove('lyric-notation-focus');
    });
  }

  addClickListener(wrapper) {
    wrapper.addEventListener('click', () => {
      document.getElementById('lyricNotationForm').classList.add('d-none');
      LyricNotation.hideAllLyricNotationCards();
      const lyricNotationCard = document.querySelector(`.lyric-notation-card[data-notation-id="${this.id}"]`);
      lyricNotationCard.classList.remove('d-none');
    })
  }

  static hideAllLyricNotationCards() {
    const lyricNotationCards = document.querySelectorAll('.lyric-notation-card');
    for (let card of lyricNotationCards) {
      card.classList.add('d-none');
      card.querySelector('.btn-close').addEventListener('click', function() {
        card.classList.add('d-none');
      })
      card.querySelector('.btn-edit').addEventListener('click', function() {
        card.querySelector('.card-text').classList.add('d-none');
        card.querySelector('.form-edit').classList.remove('d-none');
      })
      card.querySelector('.btn-cancel-edit').addEventListener('click', function() {
        card.querySelector('.card-text').classList.remove('d-none');
        card.querySelector('.form-edit').classList.add('d-none');
        card.querySelector('.form-edit textarea').value = card.querySelector('.card-text').textContent;
      })
    }
  }
}