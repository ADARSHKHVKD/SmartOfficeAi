from rest_framework import serializers
from task.models import Task



# class TaskSerializer(serializers.ModelSerializer):
#     class Meta:
#         model=Task
#         fields="__all__"
class TaskSerializer(serializers.ModelSerializer):

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
            'assigned_by'
        ]

        read_only_fields = [
            'assigned_by'
        ]

