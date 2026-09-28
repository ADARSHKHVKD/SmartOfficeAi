import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})
export class Toolbar {

  username = '';
  role = '';
  menuOpen = false;

  constructor(private router: Router) {

    this.loadUser();

    // Check user again after navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        this.loadUser();

      });

  }

  loadUser() {

    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');

    if (token && user) {

      const userData = JSON.parse(user);

      this.username = userData.username;
      this.role = userData.role;

    } else {

      this.username = '';
      this.role = '';

    }

  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  goToAdmin() {

    this.menuOpen = false;

    this.router.navigate(['/admin']);

  }

  logout() {

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    this.menuOpen = false;

    this.username = '';
    this.role = '';

    this.router.navigate(['/login']);

  }

}