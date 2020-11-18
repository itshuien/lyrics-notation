class PhoneticNotation {
  constructor(id, lyricId, selectedText, content, position) {
    this.id = id;
    this.lyricId = lyricId;
    this.selectedText = selectedText;
    this.content = content;
    this.position = position;
  }
  
  annotate() {
    const wordElement = this.getWordElement();
    this.addHoverEventListener(wordElement)
    const rubyAnnotation = this.buildRubyAnnotation();
    wordElement.appendChild(rubyAnnotation);
  }

  getWordElement() {
    const lineElement = document.querySelector(`[data-line-id="${this.position.line}"]`);
    return lineElement.querySelector(`[data-char-offset="${this.position.offset}"]`);
  }

  buildRubyAnnotation() {
    const rubyText = document.createElement('rt');
    rubyText.setAttribute('data-rt', this.content);
    return rubyText;
  }

  addHoverEventListener(wordElement) {
    wordElement.addEventListener('mouseover', () => {
      if (!wordElement.querySelector('rt.phonetic-notation-hidden')) {
        wordElement.classList.add('lyric-word-focus');
      }
    })

    wordElement.addEventListener('mouseout', () => {
      if (!wordElement.querySelector('rt.phonetic-notation-hidden')) {
        wordElement.classList.remove('lyric-word-focus');
      }
    })
  }
}