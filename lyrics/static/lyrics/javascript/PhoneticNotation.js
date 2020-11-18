class PhoneticNotation {
  constructor(id, lyricId, selectedText, content, position) {
    this.id = id;
    this.lyricId = lyricId;
    this.selectedText = selectedText;
    this.content = content;
    this.position = position;
    this.card = document.querySelector(`.phonetic-notation-card[data-notation-id="${this.id}"]`);
  }

  static initializeCards() {
    const cards = document.querySelectorAll('.phonetic-notation-card');
    for (let card of cards) this.addCardEventListeners(card);
  }

  static hideAllCards() {
    const cards = document.querySelectorAll('.phonetic-notation-card');
    for (let card of cards) card.classList.add('d-none');
  }

  static showCreateCard() {
    const card = document.querySelector('.phonetic-notation-card[data-notation-id=""]');
    card.classList.remove('d-none');
  }

  static addCardEventListeners(card) {
    this.addCloseButtonEventListener(card);
    this.addCancelButtonEventListener(card);
    if (card.dataset.notationId) this.addEditButtonEventListener(card);
  }

  static addCloseButtonEventListener(card) {
    const closeButton = card.querySelector('.btn-close');
    closeButton.addEventListener('click', function() {
      card.classList.add('d-none');
      if (!card.dataset.notationId) {
        card.querySelector('.phonetic-notation-form').reset();
      }
    })
  }

  static addEditButtonEventListener(card) {
    const editButton = card.querySelector('.btn-edit');
    editButton.addEventListener('click', function() {
      card.querySelector('.card-text').classList.add('d-none');
      card.querySelector('.phonetic-notation-form').classList.remove('d-none');
    })
  }

  static addCancelButtonEventListener(card) {
    const cancelButton = card.querySelector('.btn-cancel');
    cancelButton.addEventListener('click', function() {
      if (card.dataset.notationId) {
        card.querySelector('.card-text').classList.remove('d-none');
        card.querySelector('.phonetic-notation-form').classList.add('d-none');
        card.querySelector('.phonetic-notation-form input[name="content"]').value = card.querySelector('.card-text').textContent;
      } else {
        card.classList.add('d-none');
        card.querySelector('.phonetic-notation-form').reset();
      }
    })
  }
  
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
      LyricNotationCard.hideAll();

      const phoneticNotationCard = document.querySelector(`.phonetic-notation-card[data-notation-id="${this.id}"]`);
      phoneticNotationCard.classList.remove('d-none');

      const phoneticNotationButton = document.getElementById('phonetic-notation-tool');
      phoneticNotationButton.disabled = true;
    })
  }
}