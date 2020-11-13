from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

from .models import Lyric, LyricNotation
from .utils import words_tokenizer

import json

def show(request, pk):
    lyric = Lyric.objects.get(pk=pk)
    lyric_notations = lyric.lyricnotation_set.all()

    context = {
        'lyric': lyric,
        'lyric_lines': json.dumps(lyric.lines),
        'lyric_notations': json.dumps([record for record in lyric_notations.values()]),
        'tokenized_lyric_lines': [words_tokenizer(line) for line in lyric.lines]
    }

    return render(request, 'lyrics/show.html', context)

def add_lyric_notation(request, lyric_id):
    lyric = Lyric.objects.get(pk=lyric_id)

    lyric_notation = LyricNotation(lyric=lyric,
                                    selected_text=request.POST['selected_text'],
                                    content=request.POST['content'],
                                    start_line=request.POST['start_line'],
                                    start_offset=request.POST['start_offset'],
                                    end_line=request.POST['end_line'],
                                    end_offset=request.POST['end_offset'])
    lyric_notation.save()

    return HttpResponseRedirect(reverse('lyrics:show', args=(lyric_id,)))

def remove_lyric_notation(request, lyric_notation_id):
    lyric_notation = LyricNotation.objects.get(pk=lyric_notation_id)
    lyric_notation.delete()

    return HttpResponseRedirect(reverse('lyrics:show', args=(lyric_notation.lyric_id,)))
