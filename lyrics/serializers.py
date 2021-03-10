from rest_framework import serializers

from .models import Lyric, LyricNotation, PhoneticNotation

class LyricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lyric
        fields = '__all__'

class LyricNotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LyricNotation
        fields = '__all__'

class PhoneticNotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneticNotation
        fields = '__all__'