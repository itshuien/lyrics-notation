from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Lyric
from .serializers import LyricSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lyrics(request):
    lyrics = (
        Lyric.objects.all().order_by('id') if request.user.is_superuser
        else Lyric.objects.filter(user=request.user.id)
    )

    serializer = LyricSerializer(lyrics, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lyric(request, pk):
    lyric = Lyric.objects.get(pk=pk)

    if not request.user.is_superuser and request.user != lyric.user:
        return Response(status=status.HTTP_403_FORBIDDEN)

    serializer = LyricSerializer(lyric)
    return Response(serializer.data)
