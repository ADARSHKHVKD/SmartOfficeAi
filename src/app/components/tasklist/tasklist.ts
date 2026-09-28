import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tasklist.html',
  styleUrl: './tasklist.css'
})
export class Tasklist {

  tasks: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {

    this.loadTasks();

  }

  loadTasks() {

    const token = localStorage.getItem('access_token');

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

      },

      error: (error) => {

        console.log('Error loading tasks');
        console.log(error);

      }

    });

  }

  addTask() {

    this.router.navigate(['/addtask']);

  }

  editTask(task: any) {

    this.router.navigate(['/addtask', task.id]);

  }

}