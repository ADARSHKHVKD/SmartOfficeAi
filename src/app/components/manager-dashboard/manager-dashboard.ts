import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.css'
})
export class ManagerDashboard implements OnInit {

  tasks: any[] = [];
  leaves: any[] = [];
  timesheets: any[] = [];
  attendance: any[] = [];

  taskCount = 0;
  pendingLeaves = 0;
  hoursWorked = 0;

  presentCount = 0;
  lateCount = 0;
  absentCount = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {

    const token = localStorage.getItem('access_token');

    const headers = {
      Authorization: `Bearer ${token}`
    };

    // TEAM TASKS

    this.http.get<any[]>(
      `${environment.apiUrl}/tasks/manager/`,
      { headers }
    ).subscribe({
      next: (response) => {

        this.tasks = response;

        this.taskCount = response.length;

      },
      error: (error) => {
        console.log('Manager tasks error:', error);
      }
    });


    // LEAVE REQUESTS

    this.http.get<any[]>(
      `${environment.apiUrl}/leaves/manager/`,
      { headers }
    ).subscribe({
      next: (response) => {

        this.leaves = response;

        this.pendingLeaves = response.filter(
          leave => leave.status === 'pending'
        ).length;

      },
      error: (error) => {
        console.log('Manager leaves error:', error);
      }
    });


    // TEAM TIMESHEETS

    this.http.get<any[]>(
      `${environment.apiUrl}/timesheets/manager/`,
      { headers }
    ).subscribe({
      next: (response) => {

        this.timesheets = response;

        this.hoursWorked = response.reduce(
          (total, item) =>
            total + Number(item.hours_worked || 0),
          0
        );

      },
      error: (error) => {
        console.log('Manager timesheet error:', error);
      }
    });


    // TEAM ATTENDANCE

    this.http.get<any[]>(
      `${environment.apiUrl}/attendance/manager/`,
      { headers }
    ).subscribe({
      next: (response) => {

        this.attendance = response;

        this.calculateAttendance();

      },
      error: (error) => {
        console.log('Manager attendance error:', error);
      }
    });
  }


  calculateAttendance() {

    this.presentCount = this.attendance.filter(
      item => item.status === 'present'
    ).length;

    this.lateCount = this.attendance.filter(
      item => item.status === 'late'
    ).length;

    this.absentCount = this.attendance.filter(
      item => item.status === 'absent'
    ).length;
  }

}