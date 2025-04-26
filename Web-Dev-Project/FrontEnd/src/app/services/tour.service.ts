import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Tour,
  Country,
  City,
  MealType,
  Application,
  Flight,
} from '../models/tour.model';
import { LoginResponse, RefreshTokenResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class TourService {
  private apiUrl = 'http://localhost:8000/api'; // Base URL for the backend API

  constructor(private http: HttpClient) {}

  // Fetch all tours
  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.apiUrl}/tours/`);
  }

  // Fetch a single tour by ID
  getTourById(id: number): Observable<Tour> {
    return this.http.get<Tour>(`${this.apiUrl}/tours/${id}/`);
  }

  // Fetch all countries
  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries/`);
  }

  // Fetch all cities
  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/cities/`);
  }

  // Fetch all meal types
  getMealTypes(): Observable<MealType[]> {
    return this.http.get<MealType[]>(`${this.apiUrl}/meal-types/`);
  }

  // Fetch tours by country ID
  getToursByCountry(countryId: number): Observable<Tour[]> {
    return this.http.get<Tour[]>(
      `${this.apiUrl}/tours/?country_id=${countryId}`
    );
  }

  // Fetch active tours
  getActiveTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.apiUrl}/tours/?is_active=true`);
  }

  // Fetch tours by filters (meal type, duration, city)
  findTours(
    mealTypeId?: number,
    duration?: number,
    cityId?: number
  ): Observable<Tour[]> {
    let params = [];
    if (mealTypeId) params.push(`meal_type_id=${mealTypeId}`);
    if (duration) params.push(`duration=${duration}`);
    if (cityId) params.push(`city_id=${cityId}`);
    const queryString = params.length ? `?${params.join('&')}` : '';
    return this.http.get<Tour[]>(`${this.apiUrl}/find-tours/${queryString}`);
  }

  // Fetch flights by origin, destination, and dates
  findFlights(
    originId: number,
    destinationId: number,
    departureDate: string,
    returnDate: string
  ): Observable<any> {
    const params = `?origin_id=${originId}&destination_id=${destinationId}&departure_date=${departureDate}&return_date=${returnDate}`;
    return this.http.get<any>(`${this.apiUrl}/find-flights/${params}`);
  }

  getFlightById(id: number): Observable<Flight> {
    return this.http.get<any>(`${this.apiUrl}/flights/${id}/`);
  }

  getApplicationList(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/`);
  }

  getApplicationById(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.apiUrl}/applications/${id}/`);
  }

  createApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(
      `${this.apiUrl}/applications/`,
      application
    );
  }

  updateApplication(
    id: number,
    application: Application
  ): Observable<Application> {
    return this.http.put<Application>(
      `${this.apiUrl}/applications/${id}/`,
      application
    );
  }

  getCustomRequestList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/custom-requests/`);
  }

  createTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(`${this.apiUrl}/tours/`, tour);
  }

  updateTour(id: number, tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(`${this.apiUrl}/tours/${id}/`, tour);
  }

  deleteTour(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tours/${id}/`);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, {
      username,
      password,
    });
  }

  refreshToken(token: string): Observable<{ access: string }> {
    return this.http.post<{ access: string }>(`${this.apiUrl}/refresh/`, {
      token,
    });
  }
}
