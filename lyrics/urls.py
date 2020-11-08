from django.urls import path

from . import views

app_name = 'lyrics'

urlpatterns = [
    path('<int:pk>/', views.show, name='show')
]