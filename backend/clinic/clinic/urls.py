from django.contrib import admin
from django.urls import path, include
from .views import FrontendAppView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/doctors/', include('doctors.urls')),
    path('api/patients/', include('users.urls')),
    path('api/appointments/', include('appointments.urls')),
    # Catch‑all for React frontend
    path('', FrontendAppView.as_view(), name='frontend'),
]
