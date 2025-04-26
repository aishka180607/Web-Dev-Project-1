import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer-newsletter.component.html',
  styleUrls: ['./footer-newsletter.component.css']
})
export class FooterNewsletterComponent { }
