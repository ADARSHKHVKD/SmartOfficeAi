from django.contrib import admin
from django.urls import path,include
from .import views

urlpatterns = [
    path('tasks/manager/', views.ManagerTasksView.as_view()),
   

    
]