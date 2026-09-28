from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import Timesheet
from .serializers import TimesheetSerializer


class TimesheetListCreateView(generics.ListCreateAPIView):

    queryset = Timesheet.objects.all()

    serializer_class = TimesheetSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Timesheet.objects.filter(
            employee=self.request.user
        ).order_by(
            '-work_date',
            '-id'
        )

    def perform_create(self, serializer):

        serializer.save(
            employee=self.request.user
        )


class ManagerTimesheetView(generics.ListAPIView):

    serializer_class = TimesheetSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Timesheet.objects.filter(
            employee__manager=self.request.user
        ).order_by(
            '-work_date',
            '-id'
        )