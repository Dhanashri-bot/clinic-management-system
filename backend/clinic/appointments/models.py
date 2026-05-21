from django.db import models
from users.models import User
from doctors.models import Doctor

class Appointment(models.Model):

    patient = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    doctor = models.ForeignKey(
        Doctor,
        on_delete=models.CASCADE
    )

    appointment_date = models.DateField()

    appointment_time = models.TimeField()

    status = models.CharField(
        max_length=20,
        default='Booked'
    )

    def __str__(self):
        return f"{self.patient.username} - {self.doctor.user.username}"
