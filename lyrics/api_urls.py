from django.urls import path

from . import api_views

app_name = 'lyrics'

urlpatterns = [
    path('lyrics/', api_views.lyrics),
    path('lyrics/<int:pk>', api_views.lyric),
]