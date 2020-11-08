from django.db import models
from django.contrib.postgres.fields import ArrayField

class Lyric(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200, blank=True, null=True)
    lines = ArrayField(models.TextField())
