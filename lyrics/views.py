from django.shortcuts import render

from .models import Lyric

import json

def show(request, pk):
    lyric = Lyric.objects.get(pk=pk)
    lyric_notations = lyric.lyricnotation_set.all()

    context = {
        'lyric': lyric,
        'lyric_notations': json.dumps([record for record in lyric_notations.values()])
    }

    return render(request, 'lyrics/show.html', context)
