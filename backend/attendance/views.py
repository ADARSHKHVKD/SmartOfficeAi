from datetime import datetime

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics
from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        attendance = Attendance.objects.filter(
            employee=request.user
        ).order_by('-date')

        serializer = AttendanceSerializer(
            attendance,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        today = datetime.now().date()

        attendance, created = Attendance.objects.get_or_create(
            employee=request.user,
            date=today
        )

        if attendance.check_in:
            return Response(
                {
                    'message': 'You have already checked in today.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        attendance.check_in = datetime.now().time()

        attendance.status = 'present'

        attendance.save()

        serializer = AttendanceSerializer(attendance)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


class AttendanceCheckOutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        today = datetime.now().date()

        try:
            attendance = Attendance.objects.get(
                employee=request.user,
                date=today
            )
        except Attendance.DoesNotExist:

            return Response(
                {
                    'message': 'Please check in first.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if not attendance.check_in:

            return Response(
                {
                    'message': 'Please check in first.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if attendance.check_out:

            return Response(
                {
                    'message': 'You have already checked out today.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        attendance.check_out = datetime.now().time()

        check_in = datetime.combine(
            today,
            attendance.check_in
        )

        check_out = datetime.combine(
            today,
            attendance.check_out
        )

        difference = check_out - check_in

        attendance.working_hours = round(
            difference.total_seconds() / 3600,
            2
        )

        attendance.save()

        serializer = AttendanceSerializer(attendance)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class ManagerAttendanceView(generics.ListAPIView):

    serializer_class = AttendanceSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Attendance.objects.filter(
            employee__manager=self.request.user
        ).order_by(
            '-date',
            '-id'
        )