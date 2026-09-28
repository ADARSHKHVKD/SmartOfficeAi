import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manager-leave',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './manager-leave.html',
  styleUrl: './manager-leave.css'
})
export class ManagerLeave implements OnInit {

  leaves: any[] = [];

  loading = false;

  actionLoading: number | null = null;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadManagerLeaves();
  }

  loadManagerLeaves() {

    const token = localStorage.getItem('access_token');

    this.loading = true;

    this.http.get<any[]>(
      `${environment.apiUrl}/leaves/manager/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.leaves = response;

        this.loading = false;

        console.log('Manager leaves:', response);
      },

      error: (error) => {

        console.log('Error loading manager leaves');
        console.log(error);

        this.loading = false;

      }

    });
  }

  approveLeave(leave: any) {

    this.updateLeave(
      leave,
      'approved'
    );
  }

  rejectLeave(leave: any) {

    this.updateLeave(
      leave,
      'rejected'
    );
  }

  updateLeave(
    leave: any,
    status: string
  ) {

    const token = localStorage.getItem('access_token');

    this.actionLoading = leave.id;

    const data = {
      status: status,
      manager_comment: leave.manager_comment || ''
    };

    this.http.put(
      `${environment.apiUrl}/leaves/${leave.id}/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        console.log('Leave updated successfully');

        leave.status = status;

        this.actionLoading = null;

        alert(
          status === 'approved'
            ? 'Leave approved successfully'
            : 'Leave rejected successfully'
        );

        this.loadManagerLeaves();
      },

      error: (error) => {

        console.log('Error updating leave');
        console.log(error);

        this.actionLoading = null;

        if (error.status === 403) {

          alert(
            'You are not allowed to manage this leave.'
          );

        } else {

          alert(
            'Failed to update leave.'
          );

        }

      }

    });
  }

}