from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Doctor
from .serializers import DoctorSerializer


@api_view(['GET'])
def doctor_list(request):

    doctors = Doctor.objects.all()

    serializer = DoctorSerializer(doctors, many=True)

    return Response(serializer.data)
