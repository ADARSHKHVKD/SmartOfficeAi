from django.shortcuts import render
from django.http import JsonResponse
from task.models import Task
from leave.models import Leave
from timesheet.models import Timesheet
from django.shortcuts import get_object_or_404

from rest_framework import generics
from .serializers import TaskSerializer,LeaveSerializer

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.http import Http404

from rest_framework import mixins
from rest_framework.viewsets import GenericViewSet

# Create your views here.
@api_view(['GET','POST'])
def tasklistView(request):

    if request.method == 'GET':
        tasks=Task.objects.all()
        serializer=TaskSerializer(tasks,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

    
    elif request.method=='POST':
        serializer=TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(assigned_by=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET','PUT','DELETE'])
@permission_classes([IsAuthenticated])
def taskDetailsView(request,pk):
    try:
        task=Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method =='GET':
        serializer=TaskSerializer(task)
        return Response(serializer.data,status=status.HTTP_200_OK)
    elif request.method=='PUT':
        #will update the exixting task with new editing task data
        serializer=TaskSerializer(task,data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    elif request.method =="DELETE":
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



        


    



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def myTasksView(request):

    tasks = Task.objects.filter(assigned_to=request.user)

    serializer = TaskSerializer(tasks, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK


    )


class Leaves(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        leaves=Leave.objects.filter(employee=request.user)
        serializer = LeaveSerializer(leaves,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)

    def post(self,request):
        serializer=LeaveSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(employee=request.user)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class LeaveDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get_object(self,pk):
        return get_object_or_404(
            Leave,
            pk=pk
        )
        
    def get(self,request,pk):
        leave=self.get_object(pk)
        serializer=LeaveSerializer(leave)
        return Response(serializer.data,status=status.HTTP_200_OK)

    # def put(self,request,pk):
    #     leave=self.get_object(pk)
    #     serializer=LeaveSerializer(leave,data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data,status=status.HTTP_200_OK)
    #     return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):

        leave = self.get_object(pk)


        

        if leave.manager != request.user:

            return Response(
                {
                    'message':
                    'You are not allowed to manage this leave'
                },
                status=status.HTTP_403_FORBIDDEN
            )


        new_status = request.data.get('status')

        manager_comment = request.data.get(
            'manager_comment',
            ''
        )


        if new_status not in [
            'approved',
            'rejected'
        ]:

            return Response(
                {
                    'message':
                    'Status must be approved or rejected'
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        leave.status = new_status

        leave.manager_comment = manager_comment

        leave.save()


        serializer = LeaveSerializer(leave)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def delete(self,request,pk):
        leave=self.get_object(pk)
        leave.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class ManagerLeaves(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        leaves = Leave.objects.filter(
            manager=request.user
        )

        serializer = LeaveSerializer(
            leaves,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )



class AdminLeaveView(generics.ListAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = LeaveSerializer

    def get_queryset(self):

        return Leave.objects.all().order_by('-id')







class MyLeaves(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        leaves = Leave.objects.filter(
            employee=request.user
        )

        serializer = LeaveSerializer(
            leaves,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

  









