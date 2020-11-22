window.addEventListener('load', function() {
  const container = document.getElementById('lyric');
  applyMagneticSelectionOnMouseUp(container);
  overrideCopyBehaviour(container);
  loadLyricAttributes();
  loadLyricNotations();
  loadPhoneticNotations();
  initializeViewMode();
  initializeNotationSwitches();
  initializeNotationToolbar();
  LyricNotation.initializeCards();
  PhoneticNotation.initializeCards();
})

const loadLyricAttributes = () => {
  const lyricContainer = document.getElementById('lyric');

  let lineCharOffset = 0;

  for (let lyricLine of lyricContainer.children) {
    lyricLine.setAttribute('data-char-offset', lineCharOffset)

    let wordCharOffset = 0;

    for (let word of Array.from(lyricLine.children).filter(child => child.dataset.wordId)) {
      word.setAttribute('data-char-offset', wordCharOffset)
      wordCharOffset += word.textContent.length;
    }
    lineCharOffset += wordCharOffset;
  }
}

const loadLyricNotations = () => {
  for (let notation of lyricNotations) {
    const position = {
      startLine: notation['start_line'],
      startOffset: notation['start_offset'],
      endLine: notation['end_line'],
      endOffset: notation['end_offset']
    }
    const lyricNotation = new LyricNotation(notation['id'], notation['lyric_id'], notation['selected_text'], notation['content'], position);
    lyricNotation.highlight();
  }
}

const loadPhoneticNotations = () => {
  for (let notation of phoneticNotations) {
    const position = {
      line: notation['line'],
      offset: notation['offset']
    }
    const phoneticNotation = new PhoneticNotation(notation['id'], notation['lyric_id'], notation['selected_text'], notation['content'], position);
    phoneticNotation.annotate();
  }
}

const initializeViewMode = () => {
  const viewModeDropdown = document.getElementById('lyric-view-mode');
  const viewModeButton = document.querySelector('[data-view-mode="view"]');
  const editModeButton = document.querySelector('[data-view-mode="edit"]');

  viewModeButton.addEventListener('click', function() {
    viewModeButton.classList.add('active');
    editModeButton.classList.remove('active');
    viewModeDropdown.textContent = viewModeButton.textContent;
    window.getSelection().removeAllRanges();
  })

  editModeButton.addEventListener('click', function() {
    viewModeButton.classList.remove('active');
    editModeButton.classList.add('active');
    viewModeDropdown.textContent = editModeButton.textContent;
    window.getSelection().removeAllRanges();
  })
}

const initializeNotationSwitches = () => {
  const lyricNotationSwitch = document.getElementById('lyricNotationSwitch');
  lyricNotationSwitch.addEventListener('change', function() {
    if (this.checked) {
      const lyricNotationWrappers = document.querySelectorAll('.lyric-notation[data-notation-id]');
      for (let wrapper of lyricNotationWrappers)  wrapper.classList.remove('lyric-notation-hidden');
    } else {
      const lyricNotationWrappers = document.querySelectorAll('.lyric-notation[data-notation-id]');
      for (let wrapper of lyricNotationWrappers) wrapper.classList.add('lyric-notation-hidden');
    }
  });

  const phoneticNotationSwitch = document.getElementById('phoneticNotationSwitch');
  phoneticNotationSwitch.addEventListener('change', function() {
    const phoneticallyNotation = document.querySelectorAll('.lyric-word rt[data-rt]');
    for (let notation of phoneticallyNotation) {
      this.checked ? notation.classList.remove('phonetic-notation-hidden') : notation.classList.add('phonetic-notation-hidden');
    }
  });
}

const initializeNotationToolbar = () => {
  const lyricNotationButton = document.getElementById('lyric-notation-tool');
  const phoneticNotationButton = document.getElementById('phonetic-notation-tool');

  document.addEventListener('selectionchange', function() {
    if (!window.getSelection().toString()) {
      lyricNotationButton.disabled = true;
      phoneticNotationButton.disabled = true;
    }
  })

  lyricNotationButton.addEventListener('click', function() {
    PhoneticNotation.hideAllCards();
    LyricNotation.showCreateCard();

    const selection = getSelectionDetails();
    setLyricNotationForm(selection);

    const lyricNotationCard = LyricNotation.getCard('');
    lyricNotationCard.querySelector('.selected-text').textContent = selection.text;
  });

  phoneticNotationButton.addEventListener('click', function() {
    LyricNotation.hideAllCards();
    PhoneticNotation.showCreateCard();

    const selection = getSelectionDetails();
    setPhoneticNotationForm(selection);
    
    const phoneticNotationCard = PhoneticNotation.getCard('');
    phoneticNotationCard.querySelector('.selected-text').textContent = selection.text;
  });

  const notationDisplayTool = document.getElementById('notation-display-tool');
  const notationDisplayButton = notationDisplayTool.querySelector('button');
  const notationDisplayDropdown = document.getElementById('display-notation-dropdown');
  notationDisplayButton.addEventListener('click', function() {
    notationDisplayDropdown.classList.contains('d-none') ? notationDisplayDropdown.classList.remove('d-none') : notationDisplayDropdown.classList.add('d-none');
  })

  notationDisplayTool.addEventListener('focusout', function(event) {
    if (this.contains(event.relatedTarget)) return;
    notationDisplayDropdown.classList.add('d-none');
  })
}

const setLyricNotationForm = selection => {
  const lyricNotationForm = document.querySelector('.lyric-notation-form[data-form-mode="create"]');
  lyricNotationForm['selected_text'].value = selection.text;
  lyricNotationForm['start_line'].value = selection.startLine;
  lyricNotationForm['start_offset'].value = selection.startOffsetByLine;
  lyricNotationForm['end_line'].value = selection.endLine;
  lyricNotationForm['end_offset'].value = selection.endOffsetByLine;
}

const setPhoneticNotationForm = selection => {
  const phoneticNotationForm = document.querySelector('.phonetic-notation-form[data-form-mode="create"]');
  phoneticNotationForm['selected_text'].value = selection.text;
  phoneticNotationForm['line'].value = selection.startLine;
  phoneticNotationForm['offset'].value = selection.startOffsetByLine;
}
