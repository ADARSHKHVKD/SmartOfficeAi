from django.urls import path

from .views import (
    TimesheetListCreateView,
    ManagerTimesheetView
)

urlpatterns = [

    path(
        'timesheets/',
        TimesheetListCreateView.as_view()
    ),

    path(
        'timesheets/manager/',
        ManagerTimesheetView.as_view()
    ),

]