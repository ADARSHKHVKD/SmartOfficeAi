import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-admin-leaves',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-leaves.html',
  styleUrl: './admin-leaves.css'
})
export class AdminLeaves implements OnInit {

  leaves: any[] = [];

  loading = false;
  saving = false;

  showModal = false;

  selectedLeave: any = null;

  selectedStatus = '';

  managerComment = '';


  constructor(
    private http: HttpClient
  ) {}


  ngOnInit() {

    this.loadLeaves();

  }


  // =========================
  // LOAD ALL LEAVES
  // =========================

  loadLeaves() {

    const token = localStorage.getItem('access_token');

    this.loading = true;

    this.http.get<any[]>(
      `${environment.apiUrl}/leaves/admin/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .subscribe({

      next: (response) => {

        this.leaves = response;

        this.loading = false;

      },

      error: (error) => {

        console.log('Error loading leaves');

        console.log(error);

        this.loading = false;

      }

    });

  }


  // =========================
  // OPEN DETAILS
  // =========================

  openLeave(leave: any) {

    this.selectedLeave = leave;

    this.selectedStatus = leave.status;

    this.managerComment = leave.manager_comment || '';

    this.showModal = true;

  }


  // =========================
  // CLOSE MODAL
  // =========================

  closeModal() {

    this.showModal = false;

    this.selectedLeave = null;

    this.selectedStatus = '';

    this.managerComment = '';

  }


  // =========================
  // UPDATE LEAVE
  // =========================

  updateLeave() {

    if (!this.selectedLeave) {

      return;

    }


    if (
      this.selectedStatus !== 'approved' &&
      this.selectedStatus !== 'rejected'
    ) {

      alert('Please select Approved or Rejected');

      return;

    }


    const token = localStorage.getItem('access_token');

    this.saving = true;


    const data = {

      status: this.selectedStatus,

      manager_comment: this.managerComment

    };


    this.http.put(

      `${environment.apiUrl}/leaves/${this.selectedLeave.id}/`,

      data,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    )
    .subscribe({

      next: (response) => {

        alert('Leave updated successfully');

        this.saving = false;

        this.closeModal();

        this.loadLeaves();

      },

      error: (error) => {

        console.log('Update leave error');

        console.log(error);

        console.log(error.error);

        this.saving = false;

        alert(
          error.error?.message ||
          'Failed to update leave'
        );

      }

    });

  }


  // =========================
  // DELETE
  // =========================

  deleteLeave(leave: any) {

    const confirmed = confirm(

      `Are you sure you want to delete the leave request from ${leave.employee_name}?`

    );


    if (!confirmed) {

      return;

    }


    const token = localStorage.getItem('access_token');


    this.http.delete(

      `${environment.apiUrl}/leaves/${leave.id}/`,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    )
    .subscribe({

      next: () => {

        alert('Leave deleted successfully');

        this.loadLeaves();

      },

      error: (error) => {

        console.log('Delete error');

        console.log(error);

        alert('Failed to delete leave');

      }

    });

  }


  // =========================
  // STATUS LABEL
  // =========================

  getStatusLabel(status: string) {

    if (status === 'approved') {

      return 'Approved';

    }


    if (status === 'rejected') {

      return 'Rejected';

    }


    return 'Pending';

  }

}