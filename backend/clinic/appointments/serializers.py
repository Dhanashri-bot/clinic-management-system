from rest_framework import serializers
from users.models import User
from users.serializers import PatientSerializer
from doctors.models import Doctor
from doctors.serializers import DoctorSerializer
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    patient_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='patient'),
        source='patient',
        write_only=True
    )
    doctor_id = serializers.PrimaryKeyRelatedField(
        queryset=Doctor.objects.all(),
        source='doctor',
        write_only=True
    )
    
    # Read-only nested fields for displaying full object details on GET requests
    patient = PatientSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient_id',
            'doctor_id',
            'patient',
            'doctor',
            'appointment_date',
            'appointment_time',
            'status'
        ]

    def validate(self, data):
        doctor = data.get('doctor')
        if doctor and not doctor.is_available:
            raise serializers.ValidationError({"doctor_id": "This doctor is currently not available."})
        return data
