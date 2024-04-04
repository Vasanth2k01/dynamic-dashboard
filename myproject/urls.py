from django.contrib import admin
from django.urls import path

from myproject import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/data/', views.data_submission_view),
]
