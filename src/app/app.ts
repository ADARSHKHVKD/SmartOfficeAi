import { Component } from '@angular/core';
import { Toolbar } from './components/toolbar/toolbar';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    
    RouterOutlet,
    Toolbar
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}