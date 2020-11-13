window.addEventListener('load', function() {
  loadLyricAttributes();
  loadLyricNotations();
  const lyricSelection = new LyricSelection('lyric');
  const lyricNotationForm = document.getElementById('lyricNotationForm');
  const lyricNotationFormCancelButton = lyricNotationForm.querySelector('button[value="Cancel"]')
  lyricNotationFormCancelButton.addEventListener('click', function() {
    lyricNotationForm.classList.add('d-none');
  })
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
