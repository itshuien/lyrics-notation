import factory

from django.contrib.auth.models import User
from .models import Lyric

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = 'username'
    password = 'password'
    is_superuser = False

class LyricFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Lyric

    title = 'Lyric title'
    artist = 'Lyric artist'
    lines = ['lyric line 1', 'lyric line 2', 'lyric line 3']
    user = factory.SubFactory(UserFactory)
