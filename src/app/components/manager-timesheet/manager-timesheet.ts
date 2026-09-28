import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manager-timesheet',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './manager-timesheet.html',
  styleUrl: './manager-timesheet.css'
})
export class ManagerTimesheet implements OnInit {

  timesheets: any[] = [];

  loading = false;

  totalHours = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTimesheets();
  }

  loadTimesheets() {

    const token = localStorage.getItem('access_token');

    this.loading = true;

    this.http.get<any[]>(
      `${environment.apiUrl}/timesheets/manager/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.timesheets = response;

        this.calculateTotalHours();

        this.loading = false;

        console.log('Manager timesheets:', response);
      },

      error: (error) => {

        console.log('Error loading manager timesheets');
        console.log(error);

        this.loading = false;
      }

    });
  }

  calculateTotalHours() {

    this.totalHours = this.timesheets.reduce(
      (total, item) => total + Number(item.hours_worked),
      0
    );
  }
}