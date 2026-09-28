import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-leave',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './leave.html',
  styleUrl: './leave.css'
})
export class Leave implements OnInit {

  leave = {
    leave_type: 'casual',
    start_date: '',
    end_date: '',
    reason: '',
    manager: null
  };

  managers: any[] = [];

  leaves: any[] = [];

  loading = false;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {

    this.loadManagers();

    this.loadMyLeaves();

  }


  loadManagers() {

    const token = localStorage.getItem('access_token');

    this.http.get<any[]>(
      `${environment.apiUrl}/accounts/managers/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.managers = response;

      },

      error: (error) => {

        console.log('Error loading managers');
        console.log(error);

      }

    });

  }


  loadMyLeaves() {

    const token = localStorage.getItem('access_token');

    this.http.get<any[]>(
      `${environment.apiUrl}/leaves/my/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.leaves = response;

      },

      error: (error) => {

        console.log('Error loading leaves');
        console.log(error);

      }

    });

  }


  applyLeave() {

    if (
      !this.leave.leave_type ||
      !this.leave.start_date ||
      !this.leave.end_date ||
      !this.leave.reason ||
      !this.leave.manager
    ) {

      alert('Please fill all required fields');

      return;

    }


    const token = localStorage.getItem('access_token');
    console.log(token)

    this.loading = true;


    this.http.post(
      `${environment.apiUrl}/leaves/`,
      this.leave,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        console.log('Leave applied successfully');

        alert('Leave applied successfully');

        this.loading = false;

        this.leave = {
          leave_type: 'casual',
          start_date: '',
          end_date: '',
          reason: '',
          manager: null
        };

        this.loadMyLeaves();

      },
      error: (error) => {

        console.log('Leave API error:', error);
        console.log('Django response:', error.error);

        alert(
          JSON.stringify(error.error)
        );

        this.loading = false;

      }

      // error: (error) => {

      //   console.log('Error applying leave');
      //   console.log(error);

      //   alert('Failed to apply leave');

      //   this.loading = false;

      // }

    });

  }

}