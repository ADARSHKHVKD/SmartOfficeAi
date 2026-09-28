
from django.urls import path,include
from . import views

urlpatterns = [
    


    path('tasks/',views.tasklistView),
    path('tasks/my/', views.myTasksView),
    path('tasks/<int:pk>/',views.taskDetailsView),
    

    path('leaves/', views.Leaves.as_view()),
    path('leaves/my/', views.MyLeaves.as_view()),
    path('leaves/manager/', views.ManagerLeaves.as_view()),
    path('leaves/<int:pk>/', views.LeaveDetails.as_view()),
    path('leaves/admin/',views.AdminLeaveView.as_view()),
]