from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):

    employee_name = serializers.CharField(
        source='employee.username',
        read_only=True
    )

    class Meta:
        model = Attendance

        fields = [
            'id',
            'employee',
            'employee_name',
            'date',
            'check_in',
            'check_out',
            'status',
            'working_hours'
        ]

        read_only_fields = [
            'employee',
            'employee_name',
            'working_hours'
        ]