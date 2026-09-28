from django.urls import path
from .views import (loginView,managerListView,userListView,AdminUserListView,AdminUserDetailView,createProductionUser)



urlpatterns = [
    path('login/', loginView),
    path('managers/', managerListView),
    path('users/', userListView),
    path('admin/users/',AdminUserListView.as_view()),
    path('admin/users/<int:pk>/',AdminUserDetailView.as_view()),
    path('setup-production-user/', createProductionUser),
]