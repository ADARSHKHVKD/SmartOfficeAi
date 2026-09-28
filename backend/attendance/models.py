from django.db import models
from django.conf import settings


class Attendance(models.Model):

    STATUS_CHOICES = [
        ('present', 'Present'),
        ('late', 'Late'),
        ('absent', 'Absent'),
    ]

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )

    date = models.DateField()

    check_in = models.TimeField(
        null=True,
        blank=True
    )

    check_out = models.TimeField(
        null=True,
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='present'
    )

    working_hours = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return f"{self.employee.username} - {self.date}"