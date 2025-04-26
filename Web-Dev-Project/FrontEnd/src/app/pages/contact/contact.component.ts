import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
>>>>>>> a3ea004cb77debe80fb92ccc167b12c96963d507
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactData = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private http: HttpClient) {}

  submitForm(): void {
    this.http.post('http://localhost:8000/api/custom-requests/', this.contactData).subscribe({
      next: () => {
        alert(`Thank you, ${this.contactData.name}! We have received your message.`);
        this.contactData = { name: '', email: '', message: '' };
      },
      error: (err) => {
        console.error('❌ Failed to send contact request:', err);
        alert('Failed to send message. Try again later.');
      }
    });
  }
}
