window.addEventListener('load', function() {
  const container = document.getElementById('lyric');
  applyMagneticSelectionOnMouseUp(container);
  overrideCopyBehaviour(container);
  loadLyricAttributes();
  loadLyricNotations();
  LyricNotationCard.initializeAll();
  loadPhoneticNotations();
  initializeNotationSwitches();
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
