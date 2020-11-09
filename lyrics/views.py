from django.shortcuts import render

from .models import Lyric
from .utils import words_tokenizer

import json

def show(request, pk):
    lyric = Lyric.objects.get(pk=pk)
    lyric_notations = lyric.lyricnotation_set.all()

    context = {
        'lyric': lyric,
        'lyric_notations': json.dumps([record for record in lyric_notations.values()]),
        'tokenized_lyric_lines': [words_tokenizer(line) for line in lyric.lines]
    }

    return render(request, 'lyrics/show.html', context)
