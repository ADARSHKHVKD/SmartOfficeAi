from django.contrib.auth import authenticate

from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from .serializers import LoginSerializer
from accounts.models import User
from .serializers import UserSerializer,AdminUserSerializer,LoginSerializer
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView


@api_view(['POST'])
def loginView(request):

    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    username = serializer.validated_data['username']
    password = serializer.validated_data['password']

    user = authenticate(
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {'message': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        'message': 'Login successful',
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        }
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def managerListView(request):

    managers = User.objects.filter(role='manager')

    serializer = UserSerializer(managers, many=True)

    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userListView(request):

    users = User.objects.filter(role='user')

    serializer = UserSerializer(users, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK
    )



class AdminUserListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        users = User.objects.all().order_by('id')

        serializer = AdminUserSerializer(
            users,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        serializer = AdminUserSerializer(
            data=request.data
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class AdminUserDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get_object(self, pk):

        try:
            return User.objects.get(pk=pk)

        except User.DoesNotExist:
            return None

    def get(self, request, pk):

        user = self.get_object(pk)

        if user is None:
            return Response(
                {'message': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = AdminUserSerializer(user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):

        user = self.get_object(pk)

        if user is None:
            return Response(
                {'message': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        data = request.data.copy()

        # Don't update password if it is empty
        if not data.get('password'):
            data.pop('password', None)

        serializer = AdminUserSerializer(
            user,
            data=data,
            partial=True
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):

        user = self.get_object(pk)

        if user is None:
            return Response(
                {'message': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        user.delete()

        return Response(
            {'message': 'User deleted successfully'},
            status=status.HTTP_200_OK
        )



@api_view(['POST'])
@permission_classes([AllowAny])
def setupProductionUsers(request):

    # Admin
    admin, _ = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@smartoffice.local',
            'role': 'admin'
        }
    )

    admin.role = 'admin'
    admin.set_password('admin')
    admin.save()

    # Manager
    manager, _ = User.objects.get_or_create(
        username='manager1',
        defaults={
            'email': 'manager1@smartoffice.local',
            'role': 'manager'
        }
    )

    manager.role = 'manager'
    manager.set_password('manager@123')
    manager.save()

    # Adarsh
    adarsh, _ = User.objects.get_or_create(
        username='adarsh',
        defaults={
            'email': 'adarsh@smartoffice.local',
            'role': 'user'
        }
    )

    adarsh.role = 'user'
    adarsh.manager = manager
    adarsh.set_password('adarsh@123')
    adarsh.save()

    # Athul
    athul, _ = User.objects.get_or_create(
        username='athul',
        defaults={
            'email': 'athul@smartoffice.local',
            'role': 'user'
        }
    )

    athul.role = 'user'
    athul.manager = manager
    athul.set_password('athul@123')
    athul.save()

    return Response({
        'message': 'Production users setup successfully',
        'users': [
            {
                'username': 'admin',
                'role': admin.role
            },
            {
                'username': 'manager1',
                'role': manager.role
            },
            {
                'username': 'adarsh',
                'role': adarsh.role,
                'manager': adarsh.manager.username
            },
            {
                'username': 'athul',
                'role': athul.role,
                'manager': athul.manager.username
            }
        ]
    })