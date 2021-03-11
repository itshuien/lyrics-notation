from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from django.core.exceptions import ObjectDoesNotExist

from ..models import Lyric, LyricNotation
from ..serializers import LyricNotationSerializer

class LyricNotationViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LyricNotationSerializer

    def list(self, request, lyric_id):
        try:
            lyric = Lyric.objects.get(pk=lyric_id)

            if not request.user.is_superuser and request.user != lyric.user:
                return Response(status=status.HTTP_403_FORBIDDEN)

            lyric_notations = lyric.lyricnotation_set.all()
            serializer = LyricNotationSerializer(lyric_notations, many=True)
            
            return Response(serializer.data)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def create(self, request, lyric_id):
        try:
            serializer = LyricNotationSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(data=e.detail, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, pk):
        try:
            lyric_notation = LyricNotation.objects.get(pk=pk)
            serializer = LyricNotationSerializer(lyric_notation)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def update(self, request, pk):
        try:
            lyric_notation = LyricNotation.objects.get(pk=pk)

            serializer = LyricNotationSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.update(lyric_notation, serializer.validated_data)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response(data=e.detail, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def destroy(self, request, pk):
        try:
            lyric_notation = LyricNotation.objects.get(pk=pk)
            lyric_notation.delete()

            return Response(status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
