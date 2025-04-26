from django.db import models
from django.db.models import JSONField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

class Country(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.CharField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"

    def __str__(self):
        return self.name

class City(models.Model):
    name = models.CharField(max_length=100)
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')
    images = JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "City"
        verbose_name_plural = "Cities"

    def __str__(self):
        return f"{self.name}, {self.country.name}"


class MealType(models.Model):
    type = models.CharField(max_length=20, unique=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.type


class Flight(models.Model):
    airline = models.CharField(max_length=100)
    flight_number = models.CharField(max_length=10)
    departure = models.DateTimeField()
    arrival = models.DateTimeField()
    origin = models.ForeignKey(City, on_delete=models.CASCADE, related_name='flights_from')
    destination = models.ForeignKey(City, on_delete=models.CASCADE, related_name='flights_to')
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], default=0)
    icon = models.CharField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return f"{self.airline} {self.flight_number}: {self.origin.name} to {self.destination.name}"
    
    def clean(self):
        if self.departure >= self.arrival:
            raise ValidationError("Departure time must be before arrival time.")


class Hotel(models.Model):
    name = models.CharField(max_length=100)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='hotels')
    address = models.CharField(max_length=255)
    rating = models.FloatField(validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])
    description = models.TextField(null=True, blank=True)
    images = JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return f"{self.name}, {self.city.name}"

   
class Tour(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.IntegerField(validators=[MinValueValidator(1)], null=True, blank=True)  # Duration in days
    price = models.DecimalField(max_digits=10, decimal_places=2)
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='tours')
    meal_type = models.ForeignKey(MealType, on_delete=models.CASCADE, related_name='tours')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return f"{self.name} ({self.duration} days)"

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()
    
    def clean(self):
        if self.start_date >= self.end_date:
            raise ValidationError("Start date must be before end date.")
        
    # def find_appropriate_flights(self):
    #     flights_to = Flight.objects.filter(departure__date=self.start_date)
    #     flights_back = Flight.objects.filter(arrival__date=self.end_date)
    #     return flights_to, flights_back

class Application(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    email = models.EmailField()
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='applications')
    flights_to = models.ManyToManyField(Flight, related_name='applications_to', blank=True)  # Multiple flights to destination
    flights_back = models.ManyToManyField(Flight, related_name='applications_back', blank=True)  # Multiple flights back home
    total_price = models.DecimalField(max_digits=10, decimal_places=2, editable=False, default=0)
    status = models.CharField(max_length=20, choices=[('new', 'New'), ('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='new')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return f"Application for {self.tour.name}, client: {self.name}"

    def calculate_total_price(self):
        tour_price = self.tour.price
        flights_to_price = sum(flight.price for flight in self.flights_to.all())
        flights_back_price = sum(flight.price for flight in self.flights_back.all())
        return tour_price + flights_to_price + flights_back_price

    # def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)



class CustomRequest(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return f"Custom request from {self.name}"
