from rest_framework import serializers
from django.db import transaction
from users.models import User
from .models import Doctor

class DoctorSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name', required=False, allow_blank=True)
    last_name = serializers.CharField(source='user.last_name', required=False, allow_blank=True)
    email = serializers.EmailField(source='user.email')
    phone_number = serializers.CharField(source='user.phone_number', required=False, allow_blank=True, allow_null=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Doctor
        fields = [
            'id',
            'user_id',
            'username',
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'specialization',
            'fee',
            'is_available'
        ]

    def validate_username(self, value):
        user_exists = User.objects.filter(username=value)
        if self.instance:
            user_exists = user_exists.exclude(pk=self.instance.user.pk)
        if user_exists.exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        email_exists = User.objects.filter(email=value)
        if self.instance:
            email_exists = email_exists.exclude(pk=self.instance.user.pk)
        if email_exists.exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        with transaction.atomic():
            user = User.objects.create(
                username=user_data['username'],
                first_name=user_data.get('first_name', ''),
                last_name=user_data.get('last_name', ''),
                email=user_data['email'],
                phone_number=user_data.get('phone_number', ''),
                role='doctor'
            )
            user.set_password('doctor123')
            user.save()
            doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        with transaction.atomic():
            if user_data:
                user = instance.user
                user.username = user_data.get('username', user.username)
                user.first_name = user_data.get('first_name', user.first_name)
                user.last_name = user_data.get('last_name', user.last_name)
                user.email = user_data.get('email', user.email)
                user.phone_number = user_data.get('phone_number', user.phone_number)
                user.save()
            
            instance.specialization = validated_data.get('specialization', instance.specialization)
            instance.fee = validated_data.get('fee', instance.fee)
            instance.is_available = validated_data.get('is_available', instance.is_available)
            instance.save()
        return instance