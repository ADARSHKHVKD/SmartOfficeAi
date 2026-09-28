import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';

  constructor(private http: HttpClient,private router: Router) {}

  login() {

    const loginData = {
      username: this.username,
      password: this.password
    };

    this.http.post<any>(
      `${environment.apiUrl}/accounts/login/`,
      loginData
    ).subscribe({

      next: (response) => {

  console.log('Login successful');

  localStorage.setItem(
    'access_token',
    response.access
  );

  localStorage.setItem(
    'refresh_token',
    response.refresh
  );

  localStorage.setItem(
    'user',
    JSON.stringify(response.user)
  );

  // Redirect to dashboard
  this.router.navigate(['/dashboard']);

},

      error: (error) => {

        console.log('Login failed');
        console.log(error);

        alert('Invalid username or password');
      }

    });
  }
}

