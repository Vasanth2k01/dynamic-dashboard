from django.contrib import admin
from django.urls import path

from myproject import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/url/', views.read_from_url),
]
