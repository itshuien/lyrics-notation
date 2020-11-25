class Notation {
  constructor(id, lyricId, selectedText, content, position) {
    this.id = id;
    this.lyricId = lyricId;
    this.position = position;
    this.selectedText = selectedText;
    this.content = content;
  }

  static get notationType() { return '' };

  static getCard(id) {
    return document.querySelector(`.${this.notationType}-notation-card[data-notation-id="${id}"]`);
  }

  static hideAllCards() {
    const cards = document.querySelectorAll(`.${this.notationType}-notation-card`);
    for (let card of cards) card.classList.add('d-none');
  }

  static showCreateCard() {
    const card = document.querySelector(`.${this.notationType}-notation-card[data-notation-id=""]`);
    card.classList.remove('d-none');
  }

  static initializeCards() {
    const cards = document.querySelectorAll(`.${this.notationType}-notation-card`);
    for (let card of cards) this.addCardEventListeners(card);
  }

  static addCardEventListeners(card) {
    this.addCloseButtonEventListener(card);
    this.addCancelButtonEventListener(card);
    if (card.dataset.notationId) this.addEditButtonEventListener(card);
  }

  static addCloseButtonEventListener(card) {
    const closeButton = card.querySelector('.btn-close');
    closeButton.addEventListener('click', () => {
      card.classList.add('d-none');
      if (!card.dataset.notationId) {
        card.querySelector(`.${this.notationType}-notation-form`).reset();
      }
    })
  }

  static addEditButtonEventListener(card) {
    const editButton = card.querySelector('.btn-edit');
    editButton.addEventListener('click', () => {
      card.querySelector('.card-text').classList.add('d-none');
      card.querySelector(`.${this.notationType}-notation-form`).classList.remove('d-none');
    })
  }

  static addCancelButtonEventListener(card) {
    const cancelButton = card.querySelector('.btn-cancel');
    const form = card.querySelector(`.${this.notationType}-notation-form`);

    cancelButton.addEventListener('click', () => {
      if (card.dataset.notationId) {
        card.querySelector('.card-text').classList.remove('d-none');
        form.classList.add('d-none');
        form['content'].value = card.querySelector('.card-text').textContent;
      } else {
        card.classList.add('d-none');
        form.reset();
      }
    })
  }

  static hideCardMenuButtons() {
    const cards = document.querySelectorAll(`.lyric-notation-card, .phonetic-notation-card`);
    for (let card of cards) {
      if (card.dataset.notationId) card.querySelector('#cardMenuButton').classList.add('d-none');
    }
  }

  static showCardMenuButtons() {
    const cards = document.querySelectorAll(`.lyric-notation-card, .phonetic-notation-card`);
    for (let card of cards) {
      if (card.dataset.notationId) card.querySelector('#cardMenuButton').classList.remove('d-none');
    }
  }
}