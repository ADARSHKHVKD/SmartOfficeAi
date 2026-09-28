import { Component } from '@angular/core';
import { AiChatbot } from '../ai-chatbot/ai-chatbot';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  
} from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,

  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AiChatbot
  ],

  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {

  role = '';

  constructor() {

    const user = localStorage.getItem('user');

    if (user) {

      const userData = JSON.parse(user);

      this.role = userData.role;

    }

  }

}