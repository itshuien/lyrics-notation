class LyricNotationCard {
  constructor(notationId) {
    this.card = document.querySelector(`.lyric-notation-card[data-notation-id="${notationId}"]`);
  }

  static initializeAll() {
    const cards = document.querySelectorAll('.lyric-notation-card');
    for (let card of cards) {
      LyricNotationCard.addButtonEventListeners(card);
    }
  }

  static hideAll() {
    const cards = document.querySelectorAll('.lyric-notation-card');
    for (let card of cards) {
      card.classList.add('d-none');
    }
  }

  static addButtonEventListeners(card) {
    LyricNotationCard.addCloseButtonEventListener(card);
    LyricNotationCard.addCancelButtonEventListener(card);
    if (card.dataset.notationId) {
      LyricNotationCard.addEditButtonEventListener(card);
    }
  }

  static addCloseButtonEventListener(card) {
    const closeButton = card.querySelector('.btn-close');
    closeButton.addEventListener('click', function() {
      card.classList.add('d-none');
      if (!card.dataset.notationId) {
        card.querySelector('#lyricNotationForm').reset();
      }
    })
  }

  static addEditButtonEventListener(card) {
    const editButton = card.querySelector('.btn-edit');
    editButton.addEventListener('click', function() {
      card.querySelector('.card-text').classList.add('d-none');
      card.querySelector('#lyricNotationForm').classList.remove('d-none');
    })
  }

  static addCancelButtonEventListener(card) {
    const cancelButton = card.querySelector('.btn-cancel');
    cancelButton.addEventListener('click', function() {
      if (card.dataset.notationId) {
        card.querySelector('.card-text').classList.remove('d-none');
        card.querySelector('#lyricNotationForm').classList.add('d-none');
        card.querySelector('#lyricNotationForm textarea').value = card.querySelector('.card-text').textContent;
      } else {
        card.classList.add('d-none');
        card.querySelector('#lyricNotationForm').reset();
      }
    })
  }

  show() {
    this.card.classList.remove('d-none');
  }

  setSelectedText(text) {
    this.card.querySelector('.selected-text').textContent = text;
  }
}