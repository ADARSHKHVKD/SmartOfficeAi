import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-manager-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manager-attendance.html',
  styleUrl: './manager-attendance.css'
})
export class ManagerAttendance implements OnInit {

  attendance: any[] = [];

  loading = false;

  totalEmployees = 0;
  presentCount = 0;
  lateCount = 0;
  absentCount = 0;
  totalHours = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAttendance();
  }

  loadAttendance() {

    const token = localStorage.getItem('access_token');

    this.loading = true;

    this.http.get<any[]>(
      `${environment.apiUrl}/attendance/manager/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.attendance = response;

        this.calculateSummary();

        this.loading = false;

        console.log('Manager attendance:', response);
      },

      error: (error) => {

        console.log('Error loading manager attendance');
        console.log(error);

        this.loading = false;
      }

    });
  }

  calculateSummary() {

    const employees = new Set(
      this.attendance.map(item => item.employee)
    );

    this.totalEmployees = employees.size;

    this.presentCount = this.attendance.filter(
      item => item.status === 'present'
    ).length;

    this.lateCount = this.attendance.filter(
      item => item.status === 'late'
    ).length;

    this.absentCount = this.attendance.filter(
      item => item.status === 'absent'
    ).length;

    this.totalHours = this.attendance.reduce(
      (total, item) => total + Number(item.working_hours || 0),
      0
    );
  }

  refreshAttendance() {
    this.loadAttendance();
  }

}