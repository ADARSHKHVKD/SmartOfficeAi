from rest_framework import serializers
from task.models import Task
from leave.models import Leave


# class TaskSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=Task
#         fields="__all__"
from rest_framework import serializers
from task.models import Task


class TaskSerializer(serializers.ModelSerializer):

    assigned_to_name = serializers.CharField(
        source='assigned_to.username',
        read_only=True
    )

    assigned_by_name = serializers.CharField(
        source='assigned_by.username',
        read_only=True
    )

    class Meta:
        model = Task

        fields = [
            'id',
            'task_name',
            'project_name',
            'description',
            'start_date',
            'end_date',
            'status',
            'priority',
            'assigned_to',
            'assigned_to_name',
            'assigned_by',
            'assigned_by_name'
        ]

        read_only_fields = [
            'assigned_by',
            'assigned_by_name',
            'assigned_to_name'
        ]





class LeaveSerializer(serializers.ModelSerializer):

    employee_name = serializers.CharField(
        source='employee.username',
        read_only=True
    )

    manager_name = serializers.CharField(
        source='manager.username',
        read_only=True
    )

    class Meta:
        model = Leave

        fields = [
            'id',
            'leave_type',
            'start_date',
            'end_date',
            'reason',
            'status',
            'manager_comment',
            'employee',
            'employee_name',
            'manager',
            'manager_name'
        ]

        read_only_fields = [
            'employee',
            'employee_name',
            'manager_name',
            'status',
            'manager_comment'
        ]
