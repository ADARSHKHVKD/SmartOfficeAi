import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-timesheet',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './timesheet.html',
  styleUrl: './timesheet.css'
})
export class Timesheet implements OnInit {

  timesheets: any[] = [];

  tasks: any[] = [];

  loading = false;

  taskLoading = false;

  timesheet = {
    task: null,
    project_name: '',
    work_date: '',
    hours_worked: null,
    description: ''
  };

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {

    this.loadTasks();

    this.loadTimesheets();

  }


  // =========================
  // LOAD TASKS
  // =========================

  loadTasks() {

    const token = localStorage.getItem('access_token');

    this.taskLoading = true;

    this.http.get<any[]>(
      `${environment.apiUrl}/tasks/my/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.tasks = response;

        this.taskLoading = false;

        console.log('My tasks:', response);

      },

      error: (error) => {

        console.log('Error loading tasks');
        console.log(error);

        this.taskLoading = false;

      }

    });

  }


  // =========================
  // LOAD TIMESHEETS
  // =========================

  loadTimesheets() {

    const token = localStorage.getItem('access_token');

    this.loading = true;

    this.http.get<any[]>(
      `${environment.apiUrl}/timesheets/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.timesheets = response;

        this.loading = false;

        console.log('Timesheets:', response);

      },

      error: (error) => {

        console.log('Error loading timesheets');
        console.log(error);

        this.loading = false;

      }

    });

  }


  // =========================
  // TASK SELECT
  // =========================

  taskChanged() {

    const selectedTask = this.tasks.find(
      task => task.id == this.timesheet.task
    );

    if (selectedTask) {

      this.timesheet.project_name =
        selectedTask.project_name;

    }

  }


  // =========================
  // ADD TIMESHEET
  // =========================

  addTimesheet() {

    if (
      !this.timesheet.task ||
      !this.timesheet.project_name ||
      !this.timesheet.work_date ||
      !this.timesheet.hours_worked ||
      !this.timesheet.description
    ) {

      alert('Please fill all required fields');

      return;

    }


    if (
      Number(this.timesheet.hours_worked) <= 0
    ) {

      alert('Hours worked must be greater than 0');

      return;

    }


    const token = localStorage.getItem('access_token');

    this.loading = true;


    this.http.post(
      `${environment.apiUrl}/timesheets/`,
      this.timesheet,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        console.log(
          'Timesheet added successfully'
        );

        alert(
          'Timesheet added successfully'
        );

        this.loading = false;


        this.timesheet = {

          task: null,

          project_name: '',

          work_date: '',

          hours_worked: null,

          description: ''

        };


        this.loadTimesheets();

      },

      error: (error) => {

        console.log(
          'Error adding timesheet'
        );

        console.log(error);

        this.loading = false;

        alert(
          'Failed to add timesheet'
        );

      }

    });

  }

}