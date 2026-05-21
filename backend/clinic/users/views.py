from rest_framework import viewsets
from .models import User
from .serializers import PatientSerializer

class PatientViewSet(viewsets.ModelViewSet):
    serializer_class = PatientSerializer

    def get_queryset(self):
        # Only return users who are patients
        return User.objects.filter(role='patient').order_by('-id')

    def perform_create(self, serializer):
        # Automatically set role and a default password
        user = serializer.save(role='patient')
        user.set_password('patient123')
        user.save()
