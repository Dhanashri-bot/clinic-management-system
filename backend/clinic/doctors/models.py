from django.db import models
from users.models import User

class Doctor(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    specialization = models.CharField(max_length=100)

    fee = models.IntegerField()

    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.user.username
