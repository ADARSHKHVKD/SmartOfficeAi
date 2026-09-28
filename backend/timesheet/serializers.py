from rest_framework import serializers

from .models import Timesheet


class TimesheetSerializer(serializers.ModelSerializer):

    task_name = serializers.CharField(
        source='task.task_name',
        read_only=True
    )

    employee_name = serializers.CharField(
        source='employee.username',
        read_only=True
    )

    class Meta:

        model = Timesheet

        fields = [
            'id',
            'employee',
            'employee_name',
            'task',
            'task_name',
            'project_name',
            'work_date',
            'hours_worked',
            'description'
        ]

        read_only_fields = [
            'employee',
            'employee_name',
            'task_name'
        ]