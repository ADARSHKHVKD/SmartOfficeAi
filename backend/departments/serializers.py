from rest_framework import serializers
from .models import Department


class DepartmentSerializer(serializers.ModelSerializer):

    manager_name = serializers.CharField(
        source='manager.username',
        read_only=True
    )

    class Meta:
        model = Department
        fields = [
            'id',
            'name',
            'description',
            'manager',
            'manager_name',
            'created_at'
        ]

        read_only_fields = [
            'manager_name',
            'created_at'
        ]