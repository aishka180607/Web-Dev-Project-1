import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  searchText = '';
  @Output() search = new EventEmitter<string>();
  isAuthenticated = false;

  constructor(private router: Router) {
    this.isAuthenticated = !!localStorage.getItem('token'); // Check if a token exists
  }

  onSearch() {
    this.search.emit(this.searchText);
  }

  logout(): void {
    localStorage.removeItem('token'); // Remove the token
    localStorage.removeItem('refresh'); // Remove the refresh token if stored
    this.isAuthenticated = false; // Update the authentication state
    this.router.navigate(['/home']); // Redirect to home
  }
}
