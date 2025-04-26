import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { WhyChooseComponent } from '../../components/why-choose/why-choose.component';
import { PopularToursComponent } from '../../components/popular-tours/popular-tours.component';
import { ReviewsComponent } from '../../components/reviews/reviews.component';
import { FooterNewsletterComponent } from '../../components/footer-newsletter/footer-newsletter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    WhyChooseComponent,
    PopularToursComponent,
    ReviewsComponent,
    FooterNewsletterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor() {
    console.log('HomeComponent initialized');
  }
}
