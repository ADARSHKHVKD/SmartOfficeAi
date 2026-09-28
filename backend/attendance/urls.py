from django.urls import path

from .views import (
    AttendanceView,
    AttendanceCheckOutView,
    ManagerAttendanceView
)


urlpatterns = [

    path(
        'attendance/',
        AttendanceView.as_view()
    ),

    path(
        'attendance/checkout/',
        AttendanceCheckOutView.as_view()
    ),

    path(
        'attendance/manager/',
        ManagerAttendanceView.as_view()
    ),

]