from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse

from .models import Lyric, LyricNotation, PhoneticNotation
from .utils import words_tokenizer

import json

def index(request):
    context = {
        'lyrics': Lyric.objects.all
    }
    return render(request, 'lyrics/index.html', context)

def show(request, pk):
    lyric = Lyric.objects.get(pk=pk)
    lyric_notations = lyric.lyricnotation_set.all()
    phonetic_notations = lyric.phoneticnotation_set.all()

    context = {
        'lyric': lyric,
        'lyric_lines': json.dumps(lyric.lines),
        'lyric_notations': json.dumps([record for record in lyric_notations.values()]),
        'tokenized_lyric_lines': [words_tokenizer(line) for line in lyric.lines],
        'phonetic_notations': json.dumps([record for record in phonetic_notations.values()]),
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

def update_lyric_notation(request, lyric_notation_id):
    lyric_notation = LyricNotation.objects.get(pk=lyric_notation_id)
    lyric_notation.content = request.POST['content']
    lyric_notation.save()

    return HttpResponseRedirect(reverse('lyrics:show', args=(lyric_notation.lyric_id,)))

def delete_lyric_notation(request, lyric_notation_id):
    lyric_notation = LyricNotation.objects.get(pk=lyric_notation_id)
    lyric_notation.delete()

    return HttpResponseRedirect(reverse('lyrics:show', args=(lyric_notation.lyric_id,)))
