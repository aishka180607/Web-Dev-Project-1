import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Review {
  text: string;
  reviewer: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit, OnDestroy {
  reviews: Review[] = [
    {
      text: "Excellent Service! I had an amazing experience with this company. The service was top-notch, and the staff was incredibly friendly. I highly recommend them!",
      reviewer: "John Ivanov"
    },
    {
      text: "Outstanding experience! My entire family loved the tour and the guides were extremely knowledgeable.",
      reviewer: "Aigerim Bekova"
    },
    {
      text: "Absolutely wonderful trip. The attention to detail and the personalized approach made it unforgettable.",
      reviewer: "Alexei Petrov"
    },
    {
      text: "One of the best tours I've ever taken. Everything was perfectly organized and delivered with excellence.",
      reviewer: "Nurlan Sadykov"
    },
    {
      text: "Very impressive service, extremely professional and friendly. I would definitely travel with them again.",
      reviewer: "Marina Alexandrova"
    }
  ];

  currentReviewIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    this.startAutoRotation();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startAutoRotation(): void {
    this.intervalId = setInterval(() => {
      this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviews.length;
    }, 5000);
  }

  resetAutoRotation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.startAutoRotation();
  }

  prevReview(): void {
    this.currentReviewIndex = (this.currentReviewIndex - 1 + this.reviews.length) % this.reviews.length;
    this.resetAutoRotation();
  }

  nextReview(): void {
    this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviews.length;
    this.resetAutoRotation();
  }
}
