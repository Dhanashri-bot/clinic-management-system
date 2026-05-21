from users.models import User
from doctors.models import Doctor
from appointments.models import Appointment
from datetime import date, time

print("Seeding initial clinic database...")

# Create patients
p1, created = User.objects.get_or_create(username='john_doe', defaults={
    'first_name': 'John', 
    'last_name': 'Doe', 
    'email': 'john.doe@email.com',
    'phone_number': '9876543210', 
    'age': 35, 
    'gender': 'Male', 
    'address': '123 Main St, New York', 
    'role': 'patient'
})
if created: 
    p1.set_password('patient123')
    p1.save()

p2, created = User.objects.get_or_create(username='jane_smith', defaults={
    'first_name': 'Jane', 
    'last_name': 'Smith', 
    'email': 'jane.smith@email.com',
    'phone_number': '8765432109', 
    'age': 28, 
    'gender': 'Female', 
    'address': '456 Oak Ave, California', 
    'role': 'patient'
})
if created: 
    p2.set_password('patient123')
    p2.save()

# Create doctors
u_doc1, created = User.objects.get_or_create(username='dr_smith', defaults={
    'first_name': 'Sarah', 
    'last_name': 'Smith', 
    'email': 'sarah.smith@clinic.com',
    'phone_number': '7654321098', 
    'age': 45, 
    'gender': 'Female', 
    'address': '789 Pine Rd, Boston', 
    'role': 'doctor'
})
if created: 
    u_doc1.set_password('doctor123')
    u_doc1.save()

doc1, _ = Doctor.objects.get_or_create(
    user=u_doc1, 
    defaults={
        'specialization': 'Cardiologist', 
        'fee': 800, 
        'is_available': True
    }
)

u_doc2, created = User.objects.get_or_create(username='dr_patel', defaults={
    'first_name': 'Raj', 
    'last_name': 'Patel', 
    'email': 'raj.patel@clinic.com',
    'phone_number': '6543210987', 
    'age': 38, 
    'gender': 'Male', 
    'address': '101 Cedar Ln, Chicago', 
    'role': 'doctor'
})
if created: 
    u_doc2.set_password('doctor123')
    u_doc2.save()

doc2, _ = Doctor.objects.get_or_create(
    user=u_doc2, 
    defaults={
        'specialization': 'Pediatrician', 
        'fee': 600, 
        'is_available': True
    }
)

# Create appointments
Appointment.objects.get_or_create(
    patient=p1, 
    doctor=doc1, 
    appointment_date=date(2026, 5, 25), 
    appointment_time=time(10, 0), 
    defaults={'status': 'Booked'}
)

Appointment.objects.get_or_create(
    patient=p2, 
    doctor=doc2, 
    appointment_date=date(2026, 5, 26), 
    appointment_time=time(14, 30), 
    defaults={'status': 'Completed'}
)

print("Database seeded successfully!")
