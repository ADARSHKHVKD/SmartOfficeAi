from django.db import models
from django.conf import settings


class Leave(models.Model):

    LEAVE_TYPES = [
        ('casual', 'Casual Leave'),
        ('sick', 'Sick Leave'),
        ('annual', 'Annual Leave'),
        ('emergency', 'Emergency Leave'),
    ]

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='leaves'
    )

    manager = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='managed_leaves'
    )

    leave_type = models.CharField(
        max_length=20,
        choices=LEAVE_TYPES,
        default='casual'
    )

    start_date = models.DateField()
    end_date = models.DateField()

    reason = models.CharField(max_length=100)

    status = models.CharField(
        max_length=20,
        default='pending'
    )

    manager_comment = models.CharField(
        max_length=255,
        blank=True
    )

    def __str__(self):
        return f"{self.employee.username} - {self.leave_type}"