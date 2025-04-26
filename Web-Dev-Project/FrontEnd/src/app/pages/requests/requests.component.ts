import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TourService } from '../../services/tour.service'; // Import TourService
import { CustomRequest } from '../../models/tour.model';


@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css'],
})
export class RequestsComponent implements OnInit {
  requests: CustomRequest[] = [];
  error = '';

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.tourService.getCustomRequestList().subscribe({
      next: (data) => {
        this.requests = data;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch requests. Please try again later.';
      },
    });
  }
}
