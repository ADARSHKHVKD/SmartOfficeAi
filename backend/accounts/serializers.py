from rest_framework import serializers
from .models import User


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class AdminUserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        required=False
    )

    department_name = serializers.CharField(
        source='department.name',
        read_only=True
    )

    class Meta:
        model = User

        fields = [
            'id',
            'username',
            'email',
            'password',
            'role',
            'manager',
            'department',
            'department_name'
        ]

    def create(self, validated_data):

        password = validated_data.pop('password', None)

        user = User(**validated_data)

        if password:
            user.set_password(password)

        user.save()

        return user

    def update(self, instance, validated_data):

        password = validated_data.pop('password', None)

        for field, value in validated_data.items():
            setattr(instance, field, value)

        if password:
            instance.set_password(password)

        instance.save()

        return instance