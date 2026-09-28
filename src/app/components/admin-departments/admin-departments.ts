import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-admin-departments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-departments.html',
  styleUrl: './admin-departments.css'
})
export class AdminDepartments implements OnInit {

  departments: any[] = [];
  managers: any[] = [];

  loading = false;
  saving = false;

  showForm = false;
  editMode = false;

  selectedDepartmentId: number | null = null;

  department = {
    name: '',
    description: '',
    manager: null as number | null
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadManagers();
  }

  // -----------------------------
  // Load Departments
  // -----------------------------

  loadDepartments() {

    const token = localStorage.getItem('access_token');

    this.loading = true;

    this.http.get<any[]>(
      `${environment.apiUrl}/departments/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.departments = response;

        this.loading = false;

      },

      error: (error) => {

        console.log('Error loading departments');
        console.log(error);

        this.loading = false;

      }

    });
  }

  // -----------------------------
  // Load Managers
  // -----------------------------

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

  // -----------------------------
  // Open Add Form
  // -----------------------------

  openAddForm() {

    this.editMode = false;

    this.selectedDepartmentId = null;

    this.department = {
      name: '',
      description: '',
      manager: null
    };

    this.showForm = true;
  }

  // -----------------------------
  // Open Edit Form
  // -----------------------------

  openEditForm(department: any) {

    this.editMode = true;

    this.selectedDepartmentId = department.id;

    this.department = {
      name: department.name,
      description: department.description,
      manager: department.manager
    };

    this.showForm = true;
  }

  // -----------------------------
  // Close Form
  // -----------------------------

  closeForm() {

    this.showForm = false;

    this.editMode = false;

    this.selectedDepartmentId = null;

  }

  // -----------------------------
  // Save Department
  // -----------------------------

  saveDepartment() {

    if (!this.department.name.trim()) {

      alert('Department name is required');

      return;
    }

    const token = localStorage.getItem('access_token');

    this.saving = true;

    // UPDATE
    if (this.editMode) {

      this.http.put(

        `${environment.apiUrl}/departments/${this.selectedDepartmentId}/`,

        this.department,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      ).subscribe({

        next: () => {

          alert('Department updated successfully');

          this.saving = false;

          this.closeForm();

          this.loadDepartments();

        },

        error: (error) => {

          console.log('Update department error:', error);

          this.saving = false;

          alert('Failed to update department');

        }

      });

    }

    // CREATE
    else {

      this.http.post(

        `${environment.apiUrl}/departments/`,

        this.department,

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      ).subscribe({

        next: () => {

          alert('Department created successfully');

          this.saving = false;

          this.closeForm();

          this.loadDepartments();

        },

        error: (error) => {

          console.log('Create department error:', error);

          console.log(error.error);

          this.saving = false;

          alert('Failed to create department');

        }

      });

    }

  }

  // -----------------------------
  // Delete Department
  // -----------------------------

  deleteDepartment(department: any) {

    const confirmed = confirm(
      `Are you sure you want to delete ${department.name}?`
    );

    if (!confirmed) {

      return;

    }

    const token = localStorage.getItem('access_token');

    this.http.delete(

      `${environment.apiUrl}/departments/${department.id}/`,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    ).subscribe({

      next: () => {

        alert('Department deleted successfully');

        this.loadDepartments();

      },

      error: (error) => {

        console.log('Delete department error:', error);

        alert('Failed to delete department');

      }

    });

  }

  // -----------------------------
  // Get Manager Name
  // -----------------------------

  getManagerName(managerId: number | null) {

    if (!managerId) {

      return '-';

    }

    const manager = this.managers.find(
      item => item.id === managerId
    );

    return manager
      ? manager.username
      : '-';

  }

}