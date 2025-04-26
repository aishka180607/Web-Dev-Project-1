from django.contrib import admin
from api.models import Application, Country, City, CustomRequest, MealType, Flight, Hotel, Tour
#comment
@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name','image', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_display_links = ('id', 'name')

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'country','images', 'created_at', 'updated_at')
    search_fields = ('name', 'country__name')
    list_display_links = ('id', 'name')

@admin.register(MealType)
class MealTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'description', 'created_at', 'updated_at')
    search_fields = ('type',)
    list_display_links = ('id', 'type')

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('id', 'airline', 'flight_number', 'departure', 'arrival', 'origin', 'destination','price', 'icon', 'created_at', 'updated_at')
    search_fields = ('airline', 'flight_number', 'origin__name', 'destination__name')
    list_display_links = ('id', 'airline')

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'city', 'address', 'rating','images', 'created_at', 'updated_at')
    search_fields = ('name', 'city__name', 'address')
    list_display_links = ('id', 'name')

@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'hotel', 'price', 'meal_type', 'duration', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_display_links = ('id', 'name')

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'tour', 'get_flights_to', 'get_flights_back', 'total_price', 'status', 'created_at', 'updated_at')
    search_fields = ('name', 'email', 'phone', 'tour__name')

    def get_flights_to(self, obj):
        return ", ".join([f"{flight.airline} ({flight.flight_number})" for flight in obj.flights_to.all()])
    get_flights_to.short_description = 'Flights To'

    def get_flights_back(self, obj):
        return ", ".join([f"{flight.airline} ({flight.flight_number})" for flight in obj.flights_back.all()])
    get_flights_back.short_description = 'Flights Back'

@admin.register(CustomRequest)
class CustomRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'message', 'created_at', 'updated_at')
    search_fields = ('name', 'email')
    list_display_links = ('id', 'name')
