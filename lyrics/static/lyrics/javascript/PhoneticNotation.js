class PhoneticNotation extends Notation {
  constructor(id, lyricId, selectedText, content, position) {
    super(id, lyricId, selectedText, content, position);
  }

  static get notationType() { return 'phonetic' };
  
  annotate() {
    const wordElement = this.getWordElement();
    this.addHoverEventListener(wordElement);
    this.addClickEventListener(wordElement);
    const rubyAnnotation = this.buildRubyAnnotation();
    wordElement.appendChild(rubyAnnotation);
  }

  getWordElement() {
    const lineElement = document.querySelector(`[data-line-id="${this.position.line}"]`);
    return lineElement.querySelector(`[data-char-offset="${this.position.offset}"]`);
  }

  buildRubyAnnotation() {
    const rubyText = document.createElement('rt');
    rubyText.classList.add('phonetic-notation')
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

  addClickEventListener(wordElement) {
    wordElement.addEventListener('click', () => {
      if (wordElement.querySelector('rt').classList.contains('phonetic-notation-hidden')) return;

      PhoneticNotation.hideAllCards();
      LyricNotation.hideAllCards();

      const phoneticNotationCard = document.querySelector(`.phonetic-notation-card[data-notation-id="${this.id}"]`);
      phoneticNotationCard.classList.remove('d-none');

      const phoneticNotationButton = document.getElementById('phonetic-notation-tool');
      phoneticNotationButton.disabled = true;
    })
  }
}