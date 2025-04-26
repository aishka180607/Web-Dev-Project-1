import { Component, OnInit } from '@angular/core';
import { TourService } from '../../services/tour.service';
import { Tour,Flight } from '../../models/tour.model';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FormsModule } from '@angular/forms'

@Component({
  standalone: true,
  selector: 'app-tour-list',
  templateUrl: './tour-list.component.html',
  styleUrls: ['./tour-list.component.css'],
  imports: [RouterModule, CommonModule, NavbarComponent,FormsModule],
})
export class TourListComponent implements OnInit {
  tours: Tour[] = []; // Initialize tours as an empty array
  loading: boolean = true;
  searchQuery: string = '';
  flights: Flight[] = []

  selectedDepartureDate?: Date;
  selectedReturnDate?: Date;

  selectedOriginId?: number;
  selectedDestinationId?: number;
  selectedMealTypeId?: number;

  mealTypes: any[] = [];
  cities: any[] = [];

  constructor(private tourService: TourService, private router: Router) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.fetchTours();
  }
  loadInitialData(): void {
    this.tourService.getMealTypes().subscribe((data) => (this.mealTypes = data));
    this.tourService.getCities().subscribe((data) => (this.cities = data));
  }
  
  fetchTours(): void {
    this.loading = true;
    this.tourService.getTours().subscribe({
      next: (data) => {
        this.tours = this.shuffleArray(data).map((tour) => ({
          ...tour,
          rating: Math.floor(Math.random() * 3) + 3,
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading tours:', err);
        this.loading = false;
      },
    });
  }
  
  applyFilters() {
  const filters: any = {
    mealTypeId: this.selectedMealTypeId,
    duration: this.selectedDepartureDate && this.selectedReturnDate 
      ? this.calculateDuration(new Date(this.selectedDepartureDate), new Date(this.selectedReturnDate)) 
      : undefined,
    cityId: this.selectedDestinationId
  };

  this.loading = true;
  this.tourService.findTours(filters.mealTypeId, filters.duration, filters.cityId).subscribe({
    next: (data) => {
      console.log('Filtered tours received:', data);
      this.tours = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error fetching filtered tours:', err);
      this.loading = false;
    }
  });
}
calculateDuration(departureDate: Date, returnDate: Date): number {
  const diffTime = new Date(returnDate).getTime() - new Date(departureDate).getTime();
  return diffTime / (1000 * 3600 * 24); // Convert time difference to days
}
getRandomHotelImage(tour: any): string | null {
  const images = tour?.hotel?.images;
  if (!images || images.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}
  
  shuffleArray(array: Tour[]): Tour[] {
    return array.sort(() => Math.random() - 0.5);
  }
  
  

  viewDetails(tourId: number | undefined): void {
    if (tourId !== undefined) {
      const tourDetails = {
        selectedDepartureDate: this.selectedDepartureDate,
        selectedReturnDate: this.selectedReturnDate,
        selectedOriginId: this.selectedOriginId,
        selectedDestinationId: this.selectedDestinationId,
      }
      localStorage.setItem('tourDetails', JSON.stringify(tourDetails));
      this.router.navigate(['/tours', tourId]);
    } else {
      console.error('Invalid tour ID:', tourId);
    }
  }
  // In TourListComponent
  cleanDescription(desc?: string): string {
    if (!desc) return '';
    const sentences = desc.split('.').map(s => s.trim()).filter(Boolean);
    const sliced = sentences.slice(0, 2).join('. ');
    return sliced ? sliced + '.' : '';
  }
  getStarArray(rating: number | undefined): number[] {
    if (!rating || rating < 0) return [];
    return Array(Math.floor(rating)).fill(0);
  }
  resetFilters(): void {
    this.selectedOriginId = undefined;
    this.selectedDestinationId = undefined;
    this.selectedDepartureDate = undefined;
    this.selectedReturnDate = undefined;
    this.selectedMealTypeId = undefined;
  
    this.fetchTours();
  }
  


} 
