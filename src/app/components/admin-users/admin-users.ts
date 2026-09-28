import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {

  users: any[] = [];
  managers: any[] = [];
  departments: any[] = [];

  loading = false;
  saving = false;

  showForm = false;
  editMode = false;

  selectedUserId: number | null = null;

  user = {
    username: '',
    email: '',
    password: '',
    role: 'user',
    manager: null as number | null,
    department: null as number | null
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
    this.loadManagers();
    this.loadDepartments();
  }

  loadDepartments() {

  const token = localStorage.getItem('access_token');

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
    },

    error: (error) => {
      console.log('Error loading departments');
      console.log(error);
    }

  });

}

  loadUsers() {

    const token = localStorage.getItem('access_token');

    this.loading = true;

    this.http.get<any[]>(
      `${environment.apiUrl}/accounts/admin/users/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.users = response;

        this.loading = false;

      },

      error: (error) => {

        console.log('Error loading users');
        console.log(error);

        this.loading = false;

      }

    });
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


  openAddForm() {

    this.editMode = false;
    this.selectedUserId = null;

    this.user = {
      username: '',
      email: '',
      password: '',
      role: 'user',
      manager: null,
      department: null

    };

    this.showForm = true;
  }


  openEditForm(user: any) {

    this.editMode = true;

    this.selectedUserId = user.id;

    this.user = {
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      manager: user.manager,
      department: user.department
    };

    this.showForm = true;
  }


  getDepartmentName(departmentId: number | null) {

  if (!departmentId) {
    return '-';
  }

  const department = this.departments.find(
    item => item.id === departmentId
  );

  return department
    ? department.name
    : '-';
}


  closeForm() {

    this.showForm = false;

    this.editMode = false;

    this.selectedUserId = null;
  }


  saveUser() {

    if (!this.user.username || !this.user.email) {

      alert('Username and email are required');

      return;
    }

    if (!this.editMode && !this.user.password) {

      alert('Password is required');

      return;
    }

    const token = localStorage.getItem('access_token');

    this.saving = true;


    if (this.editMode) {

      this.http.put(
        `${environment.apiUrl}/accounts/admin/users/${this.selectedUserId}/`,
        this.user,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).subscribe({

        next: () => {

          alert('User updated successfully');

          this.saving = false;

          this.closeForm();

          this.loadUsers();

          this.loadManagers();

        },

        error: (error) => {

          console.log('Update error:', error);

          this.saving = false;

          alert('Failed to update user');

        }

      });

    } else {

      this.http.post(
        `${environment.apiUrl}/accounts/admin/users/`,
        this.user,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).subscribe({

        next: () => {

          alert('User created successfully');

          this.saving = false;

          this.closeForm();

          this.loadUsers();

          this.loadManagers();

        },

        error: (error) => {

          console.log('Create error:', error);

          this.saving = false;

          if (error.error) {
            console.log(error.error);
          }

          alert('Failed to create user');

        }

      });

    }

  }


  deleteUser(user: any) {

    const confirmed = confirm(
      `Are you sure you want to delete ${user.username}?`
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem('access_token');

    this.http.delete(
      `${environment.apiUrl}/accounts/admin/users/${user.id}/`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: () => {

        alert('User deleted successfully');

        this.loadUsers();

      },

      error: (error) => {

        console.log('Delete error:', error);

        alert('Failed to delete user');

      }

    });
  }


  getManagerName(managerId: number | null) {

    if (!managerId) {
      return '-';
    }

    const manager = this.managers.find(
      item => item.id === managerId
    );

    return manager ? manager.username : '-';
  }

}