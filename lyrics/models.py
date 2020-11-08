from django.db import models
from django.contrib.postgres.fields import ArrayField

class Lyric(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200, blank=True, null=True)
    lines = ArrayField(models.TextField())

class LyricNotation(models.Model):
    lyric           = models.ForeignKey(Lyric, on_delete=models.CASCADE)
    selected_text   = models.TextField()
    content         = models.TextField()
    start_line      = models.IntegerField()
    start_offset    = models.IntegerField()
    end_line        = models.IntegerField()
    end_offset      = models.IntegerField()
