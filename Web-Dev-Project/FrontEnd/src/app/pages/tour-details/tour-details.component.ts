import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TourService } from '../../services/tour.service';
import { Flight, Tour } from '../../models/tour.model';
import { NgFor } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-tour-details',
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css'],
  imports: [CommonModule, RouterModule, NavbarComponent],
})
export class TourDetailsComponent implements OnInit {
  tour!: Tour | undefined;
  currentImageIndex: number = 0;
  flightsTo: Flight[] = [];
  connectingFlightsTo: { firstLeg: Flight; secondLeg: Flight }[] = [];
  flightsBack: Flight[] = [];
  connectingFlightsBack: { firstLeg: Flight; secondLeg: Flight }[] = [];

  selectedFlightTo: Flight | { firstLeg: Flight; secondLeg: Flight } | null =
    null;
  selectedFlightBack: Flight | { firstLeg: Flight; secondLeg: Flight } | null =
    null;

  tourDetails: any;

  showAlert: boolean = false;
  alertMessage: string = '';

  isLoadingFlights: boolean = false; // Add loading state for flights

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const data = localStorage.getItem('tourDetails');
    if (data) {
      this.tourDetails = JSON.parse(data);
      console.log('Tour details from localStorage:', this.tourDetails); // Debug log
    } else {
      console.error('No tour details found in localStorage'); // Debug log
    }

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.tourService.getTourById(id).subscribe((tour) => {
      this.tour = tour;
      console.log('Tour details:', this.tour); // Debug log

      const originId = this.tourDetails.selectedOriginId;
      const destinationId = this.tour?.hotel?.city?.id || 0;
      const departureDate = this.tourDetails.selectedDepartureDate;
      const returnDate = this.tourDetails.selectedReturnDate;

      if (destinationId && originId && departureDate && returnDate) {
        this.isLoadingFlights = true; // Set loading state to true
        this.tourService
          .findFlights(originId, destinationId, departureDate, returnDate)
          .subscribe((flights) => {
            this.flightsTo = flights.flights_to || [];
            this.connectingFlightsTo = (
              flights.connecting_flights_to || []
            ).map((connection: any) => ({
              firstLeg: connection.first_leg,
              secondLeg: connection.second_leg,
            }));
            console.log(
              'Transformed Connecting Flights to:',
              this.connectingFlightsTo
            );

            this.flightsBack = flights.flights_back || [];
            this.connectingFlightsBack = (
              flights.connecting_flights_back || []
            ).map((connection: any) => ({
              firstLeg: connection.first_leg,
              secondLeg: connection.second_leg,
            }));
            console.log(
              'Transformed Connecting Flights back:',
              this.connectingFlightsBack
            );

            this.isLoadingFlights = false; // Set loading state to false
          });
      }
    });
  }

  selectFlightTo(flight: Flight): void {
    this.selectedFlightTo = flight;
    console.log('Selected direct flight to:', flight);
  }

  selectConnectingFlightTo(connection: {
    firstLeg: Flight;
    secondLeg: Flight;
  }): void {
    this.selectedFlightTo = connection;
    console.log('Selected connecting flight to:', connection);
  }

  selectFlightBack(flight: Flight): void {
    this.selectedFlightBack = flight;
    console.log('Selected direct flight back:', flight);
  }

  selectConnectingFlightBack(connection: {
    firstLeg: Flight;
    secondLeg: Flight;
  }): void {
    this.selectedFlightBack = connection;
    console.log('Selected connecting flight back:', connection);
  }

  goBack(): void {
    history.back();
  }

  calculateTotalPrice(): number {
    const tourPrice = Number(this.tour?.price || 0);

    const flightToPrice = this.selectedFlightTo
      ? 'price' in this.selectedFlightTo
        ? Number(this.selectedFlightTo.price)
        : Number(this.selectedFlightTo.firstLeg.price) +
          Number(this.selectedFlightTo.secondLeg.price)
      : 0;

    const flightBackPrice = this.selectedFlightBack
      ? 'price' in this.selectedFlightBack
        ? Number(this.selectedFlightBack.price)
        : Number(this.selectedFlightBack.firstLeg.price) +
          Number(this.selectedFlightBack.secondLeg.price)
      : 0;

    return tourPrice + flightToPrice + flightBackPrice;
  }

  goToBooking(): void {
    if (!this.selectedFlightTo || !this.selectedFlightBack) {
      this.alertMessage =
        'Please select both departure and return flights before booking.';
      this.showAlert = true;
      return;
    }

    if (this.tour?.id) {
      const getFlightNumber = (flight: any): string => {
        if (!flight) return 'N/A';
        if (flight.flight_number) return flight.flight_number;
        if (flight.firstLeg && flight.secondLeg) {
          return `${flight.firstLeg.flight_number} + ${flight.secondLeg.flight_number}`;
        }
        return 'N/A';
      };

      // const bookingDetails = {
      //   tour: this.tour,
      //   selectedFlightTo: {
      //     flight_number: getFlightNumber(this.selectedFlightTo),
      //   },
      //   selectedFlightBack: {
      //     flight_number: getFlightNumber(this.selectedFlightBack),
      //   },
      //   total_price: this.calculateTotalPrice(),
      // };

      const bookingDetails = {
        tour: this.tour,
        selectedFlightTo: this.selectedFlightTo,
        selectedFlightBack: this.selectedFlightBack,
        total_price: this.calculateTotalPrice(),
      };

      localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
      console.log('Booking details saved to localStorage:', bookingDetails); // Debug log
      this.router.navigate(['/book', this.tour.id]);
    }
  }

  closeAlert(): void {
    this.showAlert = false;
  }

  get images(): string[] {
    const hotelImages = this.tour?.hotel?.images || [];
    const cityImage = this.tour?.hotel?.city?.images || [];
    return [...hotelImages, ...cityImage];
  }

  nextImage(): void {
    if (this.images.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.images.length;
    }
  }

  previousImage(): void {
    if (this.images.length > 0) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    }
  }
}
