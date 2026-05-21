from rest_framework import serializers
from .models import Doctor

class DoctorSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(
        source='user.username'
    )

    class Meta:
        model = Doctor

        fields = [
            'id',
            'doctor_name',
            'specialization',
            'fee',
            'is_available'
        ]