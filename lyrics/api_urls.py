from django.urls import path

from . import api_views_old
from .api_views import LyricViewSet, LyricNotationViewSet

app_name = 'lyrics'

urlpatterns = [
    path('lyrics/', LyricViewSet.as_view({'get': 'list'})),
    path('lyrics/<int:pk>/', LyricViewSet.as_view({'get': 'retrieve'})),
    path('lyrics/<int:lyric_id>/lyric_notations/', LyricNotationViewSet.as_view({'get': 'list'})),
    path('lyrics/<int:lyric_id>/phonetic_notations/', api_views_old.phonetic_notations),
]