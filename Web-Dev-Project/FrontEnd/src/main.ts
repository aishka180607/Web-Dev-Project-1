import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/pages/home/home.component';
import { PopularToursComponent } from './app/components/popular-tours/popular-tours.component';
import { ReviewsComponent } from './app/components/reviews/reviews.component';
import { AboutComponent } from './app/pages/about/about.component';
import { ContactComponent } from './app/pages/contact/contact.component';
import { TourListComponent } from './app/pages/tour-list/tour-list.component';
import { TourDetailsComponent } from './app/pages/tour-details/tour-details.component';
import { LoginComponent } from './app/pages/login/login.component';
import { RequestsComponent } from './app/pages/requests/requests.component';
import { BookComponent } from './app/pages/book/book.component';
import { ApplicationsComponent } from './app/pages/applications/applications.component';


bootstrapApplication(AppComponent, {
  providers: [
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'tours', component: TourListComponent },
      { path: 'tours/:id', component: TourDetailsComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'login', component: LoginComponent },
      { path: 'requests', component: RequestsComponent },
      { path: 'book/:id', component: BookComponent },
      {path: 'applications', component: ApplicationsComponent},
      { path: '**', redirectTo: '' },
    ]),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));

