import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class Attendance implements OnInit {

  attendance: any[] = [];

  todayAttendance: any = null;

  loading = false;
  actionLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAttendance();
  }

  loadAttendance() {

    const token = localStorage.getItem('access_token');

    this.loading = true;

    this.http.get<any[]>(
      `${environment.apiUrl}/attendance/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.attendance = response;

        this.findTodayAttendance();

        this.loading = false;

        console.log('Attendance:', response);
      },

      error: (error) => {

        console.log('Error loading attendance');
        console.log(error);

        this.loading = false;
      }

    });
  }


  findTodayAttendance() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      today.getDate()
    ).padStart(2, '0');

    const todayDate =
      `${year}-${month}-${day}`;

    this.todayAttendance =
      this.attendance.find(
        item => item.date === todayDate
      ) || null;
  }


  checkIn() {

    const token = localStorage.getItem('access_token');

    this.actionLoading = true;

    this.http.post(
      `${environment.apiUrl}/attendance/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        console.log('Checked in:', response);

        alert('Check-in successful');

        this.actionLoading = false;

        this.loadAttendance();
      },

      error: (error) => {

        console.log('Check-in error:', error);

        this.actionLoading = false;

        if (error.error?.message) {

          alert(error.error.message);

        } else {

          alert('Failed to check in');
        }
      }

    });
  }


  checkOut() {

    const token = localStorage.getItem('access_token');

    this.actionLoading = true;

    this.http.post(
      `${environment.apiUrl}/attendance/checkout/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        console.log('Checked out:', response);

        alert('Check-out successful');

        this.actionLoading = false;

        this.loadAttendance();
      },

      error: (error) => {

        console.log('Check-out error:', error);

        this.actionLoading = false;

        if (error.error?.message) {

          alert(error.error.message);

        } else {

          alert('Failed to check out');
        }
      }

    });
  }

}