from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth.models import User

class Lyric(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200, blank=True, null=True)
    lines = ArrayField(models.TextField())
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class LyricNotation(models.Model):
    lyric           = models.ForeignKey(Lyric, on_delete=models.CASCADE)
    selected_text   = models.TextField()
    content         = models.TextField()
    start_line      = models.IntegerField()
    start_offset    = models.IntegerField()
    end_line        = models.IntegerField()
    end_offset      = models.IntegerField()

class PhoneticNotation(models.Model):
    lyric           = models.ForeignKey(Lyric, on_delete=models.CASCADE)
    selected_text   = models.CharField(max_length=50)
    content         = models.CharField(max_length=50)
    line            = models.IntegerField()
    offset          = models.IntegerField()
