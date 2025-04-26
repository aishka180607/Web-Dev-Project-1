import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DecorativeIconComponent } from './components/decorative-icon/decorative-icon.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, DecorativeIconComponent],
  template: `
    <app-decorative-icon *ngIf="showIcons"></app-decorative-icon>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  showIcons = false;

  constructor(private router: Router) {
    // Subscribe to router events
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart || event instanceof NavigationEnd)
    ).subscribe((event: NavigationStart | NavigationEnd) => {
      const path = event instanceof NavigationEnd ? event.urlAfterRedirects : '';
      
      if (event instanceof NavigationEnd) {
        // Hide icons on '/home' or '/'
        this.showIcons = path !== '/home' && path !== '/'&& path !== '/about';
      }
    });
  }
}
