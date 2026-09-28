import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ai-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ai-chatbot.html',
  styleUrl: './ai-chatbot.css'
})
export class AiChatbot {

  isOpen = false;
  message = '';
  loading = false;

  role = '';

  messages: any[] = [];

  userQuestions = [
    'My pending tasks',
    'What tasks are near deadline?',
    'What projects am I working on?',
    'Show my leave requests',
    'How many hours have I worked?',
    'What is my attendance status?'
  ];

  managerQuestions = [
    'Who is present today?',
    'Who is absent today?',
    'Show pending leave requests',
    'What projects is Adarsh working on?',
    'Show my team pending tasks',
    'Which tasks are near deadline?'
  ];

  constructor(private http: HttpClient) {

    const user = localStorage.getItem('user');

    if (user) {
      const userData = JSON.parse(user);
      this.role = userData.role;
    }

  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {

    if (!this.message.trim() || this.loading) {
      return;
    }

    const userMessage = this.message.trim();

    this.messages.push({
      sender: 'user',
      text: userMessage
    });

    this.message = '';
    this.loading = true;

    const token = localStorage.getItem('access_token');

    this.http.post<any>(
      `${environment.apiUrl}/ai/chat/`,
      {
        message: userMessage
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({

      next: (response) => {

        this.messages.push({
          sender: 'ai',
          text: response.answer
        });

        this.loading = false;

      },

      error: (error) => {

        console.log('AI Chat Error:', error);

        this.messages.push({
          sender: 'ai',
          text: 'Sorry, I could not process your request.'
        });

        this.loading = false;

      }

    });

  }

  askSuggestedQuestion(question: string) {

    this.message = question;

    this.sendMessage();

  }

  handleEnter(event: KeyboardEvent) {

    if (event.key === 'Enter' && !event.shiftKey) {

      event.preventDefault();

      this.sendMessage();

    }

  }

}