from django.urls import path

from . import views

app_name = 'lyrics'

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:pk>/', views.show, name='show'),
    path('<int:lyric_id>/add_lyric_notation/', views.add_lyric_notation, name='add_lyric_notation'),
    path('lyric_notations/<int:lyric_notation_id>/update/', views.update_lyric_notation, name='update_lyric_notation'),
    path('lyric_notations/<int:lyric_notation_id>/delete/', views.delete_lyric_notation, name='delete_lyric_notation'),
    path('<int:lyric_id>/create_phonetic_notation/', views.create_phonetic_notation, name='create_phonetic_notation'),
    path('phonetic_notations/<int:phonetic_notation_id>/update/', views.update_phonetic_notation, name='update_phonetic_notation'),
    # path('phonetic_notation/<int:phonetic_notation_id>/delete/', views.delete_phonetic_notation, name='delete_phonetic_notation'),
]