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

class LyricNotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LyricNotation
        fields = [
            'lyric',
            'selected_text',
            'content',
            'start_line',
            'start_offset',
            'end_line',
            'end_offset',
        ]

class PhoneticNotationnSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneticNotation
        fields = [
            'lyric',
            'selected_text',
            'content',
            'line',
            'offset',
        ]