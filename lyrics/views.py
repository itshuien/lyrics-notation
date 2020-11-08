from django.shortcuts import render

from .models import Lyric

def show(request, pk):
    lyric = Lyric.objects.get(pk=pk)
    return render(request, 'lyrics/show.html', { 'lyric': lyric })
