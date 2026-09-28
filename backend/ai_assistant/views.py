import os

from google import genai

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def testGemini(request):

    try:

        message = request.data.get(
            'message',
            'Explain Smart Office AI in one sentence.'
        )

        api_key = os.getenv('GEMINI_API_KEY')

        if not api_key:
            return Response(
                {
                    'message': 'GEMINI_API_KEY is not configured'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        client = genai.Client(
            api_key=api_key
        )

        response = client.models.generate_content(
            model='gemini-3.8-flash',
            contents=message
        )

        return Response(
            {
                'question': message,
                'answer': response.text
            },
            status=status.HTTP_200_OK
        )

    except Exception as error:

        print('Gemini error:', error)

        return Response(
            {
                'message': 'Gemini API request failed',
                'error': str(error)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def aiChat(request):

    try:

        message = request.data.get('message', '').strip()

        if not message:
            return Response(
                {
                    'message': 'Please enter a question'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user

        context = f"""
You are Smart Office AI, an assistant for an office management system.

Current user:
Username: {user.username}
Role: {user.role}

Answer the user's question using the office data provided below.

Be concise and easy to understand.

Office Data:

"""

        # USER DATA

        if user.role == 'user':

            from task.models import Task
            from leave.models import Leave
            from timesheet.models import Timesheet
            from attendance.models import Attendance

            tasks = Task.objects.filter(
                assigned_to=user
            )

            leaves = Leave.objects.filter(
                employee=user
            )

            timesheets = Timesheet.objects.filter(
                employee=user
            )

            attendance = Attendance.objects.filter(
                employee=user
            )

            context += "\nMY TASKS:\n"

            for task in tasks:

                context += f"""
Task: {task.task_name}
Project: {task.project_name}
Status: {task.status}
Priority: {task.priority}
Start Date: {task.start_date}
End Date: {task.end_date}
"""

            context += "\nMY LEAVES:\n"

            for leave in leaves:

                context += f"""
Leave Type: {leave.leave_type}
Start Date: {leave.start_date}
End Date: {leave.end_date}
Status: {leave.status}
Reason: {leave.reason}
"""

            context += "\nMY TIMESHEETS:\n"

            for timesheet in timesheets:

                context += f"""
Project: {timesheet.project_name}
Date: {timesheet.work_date}
Hours: {timesheet.hours_worked}
Description: {timesheet.description}
"""

            context += "\nMY ATTENDANCE:\n"

            for record in attendance:

                context += f"""
Date: {record.date}
Check In: {record.check_in}
Check Out: {record.check_out}
Status: {record.status}
Working Hours: {record.working_hours}
"""


        # MANAGER DATA

        elif user.role == 'manager':

            from task.models import Task
            from leave.models import Leave
            from timesheet.models import Timesheet
            from attendance.models import Attendance

            tasks = Task.objects.filter(
                assigned_to__manager=user
            )

            leaves = Leave.objects.filter(
                manager=user
            )

            timesheets = Timesheet.objects.filter(
                employee__manager=user
            )

            attendance = Attendance.objects.filter(
                employee__manager=user
            )

            context += "\nTEAM TASKS:\n"

            for task in tasks:

                context += f"""
Employee: {task.assigned_to.username}
Task: {task.task_name}
Project: {task.project_name}
Status: {task.status}
Priority: {task.priority}
Start Date: {task.start_date}
End Date: {task.end_date}
"""

            context += "\nTEAM LEAVES:\n"

            for leave in leaves:

                context += f"""
Employee: {leave.employee.username}
Leave Type: {leave.leave_type}
Start Date: {leave.start_date}
End Date: {leave.end_date}
Status: {leave.status}
Reason: {leave.reason}
"""

            context += "\nTEAM TIMESHEETS:\n"

            for timesheet in timesheets:

                context += f"""
Employee: {timesheet.employee.username}
Project: {timesheet.project_name}
Date: {timesheet.work_date}
Hours: {timesheet.hours_worked}
Description: {timesheet.description}
"""

            context += "\nTEAM ATTENDANCE:\n"

            for record in attendance:

                context += f"""
Employee: {record.employee.username}
Date: {record.date}
Check In: {record.check_in}
Check Out: {record.check_out}
Status: {record.status}
Working Hours: {record.working_hours}
"""


        api_key = os.getenv('GEMINI_API_KEY')

        if not api_key:

            return Response(
                {
                    'message': 'GEMINI_API_KEY is not configured'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


        client = genai.Client(
            api_key=api_key
        )


        prompt = context + f"""

USER QUESTION:

{message}

Answer only using the available office data.

IMPORTANT RESPONSE RULES:
- Use plain text only.
- Do not use Markdown.
- Do not use asterisks (*).
- Do not use double asterisks (**).
- Do not use bullet points.
- Do not use numbered lists.
- Do not use headings.
- Give the answer in simple short sentences.
- Keep the response concise.
- If the requested information is not available, clearly say that you don't have that information.
"""

        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=prompt
        )


        return Response(
            {
                'question': message,
                'answer': response.text
            },
            status=status.HTTP_200_OK
        )


    except Exception as error:

        print('AI Chat Error:', error)

        return Response(
            {
                'message': 'AI request failed',
                'error': str(error)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )