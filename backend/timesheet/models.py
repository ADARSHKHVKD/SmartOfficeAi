from django.db import models
from django.conf import settings


class Timesheet(models.Model):

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='timesheets'
    )

    task = models.ForeignKey(
        'task.Task',
        on_delete=models.CASCADE,
        related_name='timesheets'
    )

    project_name = models.CharField(max_length=100)

    work_date = models.DateField()

    hours_worked = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    description = models.TextField()

    def __str__(self):
        return f"{self.employee.username} - {self.task.task_name}"