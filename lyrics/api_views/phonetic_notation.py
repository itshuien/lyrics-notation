from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.core.exceptions import ObjectDoesNotExist

from ..models import Lyric, PhoneticNotation
from ..serializers import PhoneticNotationSerializer

class PhoneticNotationViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, lyric_id):
        try:
            lyric = Lyric.objects.get(pk=lyric_id)

            if not request.user.is_superuser and request.user != lyric.user:
                return Response(status=status.HTTP_403_FORBIDDEN)

            phonetic_notations = lyric.phoneticnotation_set.all()
            serializer = PhoneticNotationSerializer(phonetic_notations, many=True)
            
            return Response(serializer.data)

        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
