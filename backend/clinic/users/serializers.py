from rest_framework import serializers
from .models import User

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 
            'username', 
            'first_name', 
            'last_name', 
            'email', 
            'phone_number', 
            'age', 
            'gender', 
            'address',
            'role'
        ]
        extra_kwargs = {
            'role': {'read_only': True},
            'username': {'required': True},
            'email': {'required': True}
        }

    def validate_email(self, value):
        # Allow checking email duplicates except for current instance
        email_exists = User.objects.filter(email=value)
        if self.instance:
            email_exists = email_exists.exclude(pk=self.instance.pk)
        if email_exists.exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_age(self, value):
        if value is not None and (value < 0 or value > 150):
            raise serializers.ValidationError("Please provide a valid age.")
        return value
