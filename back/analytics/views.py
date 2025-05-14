from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Q
from django.utils.dateparse import parse_datetime

from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import *
from .serializers import *


class SensorDataMixin(APIView):
    sensor_model = None
    serializer_class = None

    def get_queryset(self, user):
        return self.sensor_model.objects.filter(user=user)

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset(request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        try:
            obj = self.sensor_model.objects.get(id=request.data['id'], user=request.user)
        except self.sensor_model.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
