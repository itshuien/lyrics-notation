from django.urls import path

from . import views

app_name = 'lyrics'

urlpatterns = [
    path('', views.index, name='index'),
    path('<int:pk>/', views.show, name='show'),
    path('<int:lyric_id>/add_lyric_notation/', views.add_lyric_notation, name='add_lyric_notation'),
    path('lyric_notations/<int:lyric_notation_id>/update/', views.update_lyric_notation, name='update_lyric_notation'),
    path('lyric_notations/<int:lyric_notation_id>/delete/', views.delete_lyric_notation, name='delete_lyric_notation'),
]