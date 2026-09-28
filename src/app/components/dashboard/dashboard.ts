import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  tasks: any[] = [];
  leaves: any[] = [];
  timesheets: any[] = [];
  attendance: any[] = [];

  taskCount = 0;
  pendingLeaves = 0;
  hoursWorked = 0;
  attendanceStatus = 'Not Marked';

  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {

    const token = localStorage.getItem('access_token');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    // My Tasks
    this.http.get<any[]>(
      `${environment.apiUrl}/tasks/my/`,
      { headers }
    ).subscribe({
      next: (response) => {
        this.tasks = response;
        this.taskCount = response.length;
      },
      error: (error) => {
        console.log('Tasks error:', error);
      }
    });

    // My Leaves
    this.http.get<any[]>(
      `${environment.apiUrl}/leaves/my/`,
      { headers }
    ).subscribe({
      next: (response) => {
        this.leaves = response;

        this.pendingLeaves = response.filter(
          leave => leave.status === 'pending'
        ).length;
      },
      error: (error) => {
        console.log('Leaves error:', error);
      }
    });

    // Timesheets
    this.http.get<any[]>(
      `${environment.apiUrl}/timesheets/`,
      { headers }
    ).subscribe({
      next: (response) => {
        this.timesheets = response;

        this.hoursWorked = response.reduce(
          (total, item) => total + Number(item.hours_worked || 0),
          0
        );
      },
      error: (error) => {
        console.log('Timesheet error:', error);
      }
    });

    // Attendance
    this.http.get<any[]>(
      `${environment.apiUrl}/attendance/`,
      { headers }
    ).subscribe({
      next: (response) => {
        this.attendance = response;

        if (response.length > 0) {
          this.attendanceStatus = response[0].status;
        }
      },
      error: (error) => {
        console.log('Attendance error:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}