from rest_framework import viewsets, status
from rest_framework.response import Response
from django.db import transaction
from .models import Doctor
from .serializers import DoctorSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all().order_by('-id')
    serializer_class = DoctorSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = instance.user
        with transaction.atomic():
            instance.delete()
            user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
