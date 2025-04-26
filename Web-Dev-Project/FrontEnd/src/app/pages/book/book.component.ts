import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TourService } from '../../services/tour.service'; // Import TourService
import { Application } from '../../models/tour.model';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  bookingData = {
    name: '',
    phone: '',
    email: '',
  };

  success = '';
  error = '';
  tourId!: number;
  tour: any = null;
  selectedFlightTo: any = null;
  selectedFlightBack: any = null;
  total_price: number = 0;
  showCustomAlert: boolean = false; // State for custom alert

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService // Inject TourService
  ) {}

  ngOnInit(): void {
    this.tourId = Number(this.route.snapshot.paramMap.get('id'));

    const bookingData = localStorage.getItem('bookingDetails');
    if (bookingData) {
      const parsed = JSON.parse(bookingData);
      this.tour = parsed.tour;
      this.selectedFlightTo = parsed.selectedFlightTo || parsed.connectionTo;
      this.selectedFlightBack =
        parsed.selectedFlightBack || parsed.connectionBack;
      this.total_price = parsed.total_price || 0;
    }
  }

  submitBooking(): void {
    const application: Application = {
      id: 0, // Placeholder, will be set by the backend
      name: this.bookingData.name,
      phone: this.bookingData.phone,
      email: this.bookingData.email,
      tour: this.tour.id, // Send only the tour ID
      flights_to: this.selectedFlightTo.id
        ? [this.selectedFlightTo.id]
        : [
            this.selectedFlightTo.firstLeg.id,
            this.selectedFlightTo.secondLeg.id,
          ],
      flights_back: this.selectedFlightBack.id
        ? [this.selectedFlightBack.id]
        : [
            this.selectedFlightBack.firstLeg.id,
            this.selectedFlightBack.secondLeg.id,
          ],
      total_price: this.total_price,
      status: 'new', // Default status
      created_at: new Date(),
      updated_at: new Date(),
    };

    console.log('Application Payload:', application); // Debug log

    this.tourService.createApplication(application).subscribe({
      next: () => {
        this.success = 'Thank you for booking with us!';
        this.error = '';
        this.bookingData = { name: '', phone: '', email: '' };

        // Show custom alert
        this.showCustomAlert = true;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to book tour. Try again later.';
        this.success = '';
      },
    });
  }

  closeCustomAlert(): void {
    this.showCustomAlert = false;
    this.router.navigate(['/']); // Navigate to homepage after closing alert
  }
}
