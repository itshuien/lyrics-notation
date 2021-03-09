from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from ..models import Lyric
from ..serializers import LyricSerializer

class LyricViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        lyrics = (
            Lyric.objects.all().order_by('id') if request.user.is_superuser
            else Lyric.objects.filter(user=request.user.id)
        )

        serializer = LyricSerializer(lyrics, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        lyric = Lyric.objects.get(pk=pk)

        if not request.user.is_superuser and request.user != lyric.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        serializer = LyricSerializer(lyric)
        return Response(serializer.data)