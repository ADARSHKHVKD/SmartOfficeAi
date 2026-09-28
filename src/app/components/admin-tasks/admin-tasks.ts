import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-tasks.html',
  styleUrl: './admin-tasks.css'
})
export class AdminTasks implements OnInit {

  tasks: any[] = [];
  users: any[] = [];

  loading = false;
  saving = false;

  showForm = false;
  editMode = false;

  selectedTaskId: number | null = null;

  task = {
    task_name: '',
    project_name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'pending',
    priority: 'medium',
    assigned_to: null as number | null
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks();
    this.loadUsers();
  }

  // =========================
  // LOAD ALL TASKS
  // =========================

  loadTasks() {

    const token = localStorage.getItem('access_token');

    this.loading = true;

    this.http.get<any[]>(
      `${environment.apiUrl}/tasks/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.tasks = response;

        this.loading = false;
      },

      error: (error) => {

        console.log('Error loading tasks');
        console.log(error);

        this.loading = false;
      }

    });
  }


  // =========================
  // LOAD EMPLOYEES
  // =========================

  loadUsers() {

    const token = localStorage.getItem('access_token');

    this.http.get<any[]>(
      `${environment.apiUrl}/accounts/users/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.users = response;

      },

      error: (error) => {

        console.log('Error loading employees');
        console.log(error);

      }

    });
  }


  // =========================
  // OPEN ADD FORM
  // =========================

  openAddForm() {

    this.editMode = false;

    this.selectedTaskId = null;

    this.task = {

      task_name: '',
      project_name: '',
      description: '',
      start_date: '',
      end_date: '',
      status: 'pending',
      priority: 'medium',
      assigned_to: null

    };

    this.showForm = true;
  }


  // =========================
  // OPEN EDIT FORM
  // =========================

  openEditForm(task: any) {

    this.editMode = true;

    this.selectedTaskId = task.id;

    this.task = {

      task_name: task.task_name,
      project_name: task.project_name,
      description: task.description,
      start_date: task.start_date,
      end_date: task.end_date,
      status: task.status,
      priority: task.priority,
      assigned_to: task.assigned_to

    };

    this.showForm = true;
  }


  // =========================
  // CLOSE FORM
  // =========================

  closeForm() {

    this.showForm = false;

    this.editMode = false;

    this.selectedTaskId = null;
  }


  // =========================
  // SAVE TASK
  // =========================

  saveTask() {

    if (!this.task.task_name.trim()) {

      alert('Task name is required');

      return;
    }


    if (!this.task.project_name.trim()) {

      alert('Project name is required');

      return;
    }


    if (!this.task.assigned_to) {

      alert('Please select an employee');

      return;
    }


    if (!this.task.start_date) {

      alert('Start date is required');

      return;
    }


    if (!this.task.end_date) {

      alert('End date is required');

      return;
    }


    const token = localStorage.getItem('access_token');

    this.saving = true;


    // =========================
    // UPDATE
    // =========================

    if (this.editMode) {

      this.http.put(

        `${environment.apiUrl}/tasks/${this.selectedTaskId}/`,

        this.task,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      ).subscribe({

        next: () => {

          alert('Task updated successfully');

          this.saving = false;

          this.closeForm();

          this.loadTasks();

        },

        error: (error) => {

          console.log('Update error:', error);

          console.log(error.error);

          this.saving = false;

          alert('Failed to update task');

        }

      });

    }

    // =========================
    // CREATE
    // =========================

    else {

      this.http.post(

        `${environment.apiUrl}/tasks/`,

        this.task,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      ).subscribe({

        next: () => {

          alert('Task created successfully');

          this.saving = false;

          this.closeForm();

          this.loadTasks();

        },

        error: (error) => {

          console.log('Create error:', error);

          console.log(error.error);

          this.saving = false;

          alert('Failed to create task');

        }

      });

    }

  }


  // =========================
  // DELETE TASK
  // =========================

  deleteTask(task: any) {

    const confirmed = confirm(

      `Are you sure you want to delete "${task.task_name}"?`

    );


    if (!confirmed) {

      return;

    }


    const token = localStorage.getItem('access_token');


    this.http.delete(

      `${environment.apiUrl}/tasks/${task.id}/`,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    ).subscribe({

      next: () => {

        alert('Task deleted successfully');

        this.loadTasks();

      },

      error: (error) => {

        console.log('Delete error:', error);

        alert('Failed to delete task');

      }

    });

  }


  // =========================
  // GET EMPLOYEE NAME
  // =========================

  getEmployeeName(userId: number | null) {

    if (!userId) {

      return '-';

    }


    const user = this.users.find(

      item => item.id === userId

    );


    return user ? user.username : '-';

  }


  // =========================
  // STATUS LABEL
  // =========================

  getStatusLabel(status: string) {

    if (status === 'in_progress') {

      return 'In Progress';

    }


    if (status === 'completed') {

      return 'Completed';

    }


    if (status === 'cancelled') {

      return 'Cancelled';

    }


    return 'Pending';

  }

}