import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TourService } from '../../services/tour.service'; // Import TourService
import { Application, Tour, Flight } from '../../models/tour.model'; // Import Application, Tour, and Flight interfaces
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.css'],
})
export class ApplicationsComponent implements OnInit {
  applicationsNew: Application[] = [];
  applicationsPending: Application[] = [];
  applicationsProcessed: Application[] = [];
  selectedApplication: Application | null = null; // State for selected application
  selectedTour: Tour | null = null; // State for selected tour
  selectedFlight: Flight | null = null; // State for selected flight
  error = '';

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications(): void {
    this.tourService.getApplicationList().subscribe({
      next: (applications) => {
        this.applicationsNew = applications.filter(
          (app) => app.status === 'new'
        );
        this.applicationsPending = applications.filter(
          (app) => app.status === 'pending'
        );
        this.applicationsProcessed = applications.filter(
          (app) => app.status === 'approved' || app.status === 'rejected'
        );
      },

      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch applications. Please try again later.';
      },
    });
  }

  updateStatus(application: Application, newStatus: string): void {
    const updatedApplication = { ...application, status: newStatus };

    this.tourService
      .updateApplication(updatedApplication.id, updatedApplication)
      .subscribe({
        next: () => {
          this.fetchApplications(); // Refresh the list after updating
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to update application status. Please try again.';
        },
      });
  }

  openTourDetails(tourId: number): void {
    this.tourService.getTourById(tourId).subscribe({
      next: (tour) => {
        this.selectedTour = tour;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch tour details.';
      },
    });
  }

  closeTourDetails(): void {
    this.selectedTour = null;
  }

  openFlightDetails(flightId: number): void {
    this.tourService.getFlightById(flightId).subscribe({
      next: (flight) => {
        this.selectedFlight = flight;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to fetch flight details.';
      },
    });
  }

  closeFlightDetails(): void {
    this.selectedFlight = null;
  }
}
