import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-addtask',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './addtask.html',
  styleUrl: './addtask.css'
})
export class Addtask implements OnInit {

  task = {
    task_name: '',
    project_name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: 'pending',
    priority: 'medium',
    assigned_to: null
  };

  users: any[] = [];

  loading = false;

  editMode = false;

  taskId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.loadUsers();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.editMode = true;
      this.taskId = Number(id);

      this.loadTask(this.taskId);

    }

  }

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

        console.log('Error loading users');
        console.log(error);

      }

    });

  }

  loadTask(id: number) {

    const token = localStorage.getItem('access_token');

    this.loading = true;

    this.http.get<any>(
      `${environment.apiUrl}/tasks/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        console.log('Task loaded:', response);

        this.task = {
          task_name: response.task_name,
          project_name: response.project_name,
          description: response.description,
          start_date: response.start_date,
          end_date: response.end_date,
          status: response.status,
          priority: response.priority,
          assigned_to: response.assigned_to
        };

        this.loading = false;

      },

      error: (error) => {

        console.log('Error loading task');
        console.log(error);

        this.loading = false;

        alert('Failed to load task');

        this.router.navigate(['/tasks']);

      }

    });

  }

  saveTask() {

    if (
      !this.task.task_name ||
      !this.task.project_name ||
      !this.task.description ||
      !this.task.start_date ||
      !this.task.end_date ||
      !this.task.assigned_to
    ) {

      alert('Please fill all required fields');

      return;

    }

    const token = localStorage.getItem('access_token');

    this.loading = true;

    const headers = {
      Authorization: `Bearer ${token}`
    };

    if (this.editMode && this.taskId) {

      // UPDATE TASK

      this.http.put(
        `${environment.apiUrl}/tasks/${this.taskId}/`,
        this.task,
        { headers }
      ).subscribe({

        next: (response) => {

          console.log('Task updated successfully');

          alert('Task updated successfully');

          this.loading = false;

          this.router.navigate(['/tasks']);

        },

        error: (error) => {

          console.log('Error updating task');
          console.log(error);

          alert('Failed to update task');

          this.loading = false;

        }

      });

    } else {

      // CREATE TASK

      this.http.post(
        `${environment.apiUrl}/tasks/`,
        this.task,
        { headers }
      ).subscribe({

        next: (response) => {

          console.log('Task created successfully');

          alert('Task created successfully');

          this.loading = false;

          this.router.navigate(['/tasks']);

        },

        error: (error) => {

          console.log('Error creating task');
          console.log(error);

          alert('Failed to create task');

          this.loading = false;

        }

      });

    }

  }

  cancel() {

    this.router.navigate(['/tasks']);

  }

}