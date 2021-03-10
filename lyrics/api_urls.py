from django.urls import path

from .api_views import LyricViewSet, LyricNotationViewSet, PhoneticNotationViewSet

app_name = 'lyrics'

urlpatterns = [
    path('lyrics/', LyricViewSet.as_view({'get': 'list'})),
    path('lyrics/<int:pk>/', LyricViewSet.as_view({'get': 'retrieve'})),
    path('lyrics/<int:lyric_id>/lyric_notations/', LyricNotationViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('lyrics/<int:lyric_id>/phonetic_notations/', PhoneticNotationViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('lyric_notations/<int:pk>', LyricNotationViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
    path('phonetic_notations/<int:pk>', PhoneticNotationViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'})),
]