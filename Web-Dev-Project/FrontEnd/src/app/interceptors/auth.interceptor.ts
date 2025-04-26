import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TourService } from '../services/tour.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tourService: TourService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage

    let authReq = req;
    if (token) {
      // Clone the request and add the Authorization header
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // If the token is expired, attempt to refresh it
          const refreshToken = localStorage.getItem('refresh');
          if (refreshToken) {
            return this.tourService.refreshToken(refreshToken).pipe(
              switchMap((res) => {
                // Save the new token and retry the failed request
                localStorage.setItem('token', res.access);
                const newAuthReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${res.access}`,
                  },
                });
                return next.handle(newAuthReq);
              }),
              catchError((refreshError) => {
                // If refreshing the token fails, log out the user
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                window.location.href = '/login'; // Redirect to login page
                return throwError(refreshError);
              })
            );
          } else {
            // If no refresh token is available, log out the user
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            window.location.href = '/login'; // Redirect to login page
          }
        }
        return throwError(error);
      })
    );
  }
}
