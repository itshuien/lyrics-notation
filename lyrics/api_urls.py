from django.urls import path

from . import api_views

app_name = 'lyrics'

urlpatterns = [
    path('lyrics/', api_views.lyrics),
    path('lyrics/<int:pk>/', api_views.lyric),
    path('lyrics/<int:lyric_id>/lyric_notations/', api_views.lyric_notations),
    path('lyrics/<int:lyric_id>/phonetic_notations/', api_views.phonetic_notations),
]