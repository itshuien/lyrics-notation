from rest_framework import serializers

from .models import Lyric, LyricNotation, PhoneticNotation

class LyricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lyric
        fields = [
            'title',
            'artist',
            'lines',
            'user',
            'created_at',
            'updated_at',
        ]
