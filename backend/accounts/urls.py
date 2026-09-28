from django.urls import path
from .views import (setupProductionUsers,loginView,managerListView,userListView,AdminUserListView,AdminUserDetailView)



urlpatterns = [
    path('login/', loginView),
    path('managers/', managerListView),
    path('users/', userListView),
    path('admin/users/',AdminUserListView.as_view()),
    path('admin/users/<int:pk>/',AdminUserDetailView.as_view()),

    # path('setup-production-users/', setupProductionUsers),

    
]