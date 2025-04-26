import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Import HttpClientModule and HTTP_INTERCEPTORS
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // Import the interceptor

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule], // Add HttpClientModule here
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // Allows multiple interceptors
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
