from django.core.management.base import BaseCommand
from api.models import Hotel, MealType, City, Tour

class Command(BaseCommand):
    help = 'Generate realistic tours with hotels, meal types, and durations'

    def calculate_price(self, hotel, meal_type, duration):
        base_price_per_day = 50
        rating_multiplier = hotel.rating
        meal_type_multiplier = {
            "Breakfast Only": 1.1,
            "Half Board": 1.3,
            "Full Board": 1.5,
            "All Inclusive": 1.8,
        }.get(meal_type.type, 1.0)

        total_price = base_price_per_day * duration * rating_multiplier * meal_type_multiplier
        return round(total_price, 2)

    def generate_tour_name(self, hotel, city, duration):
        return f"{duration}-Day {hotel.name} Experience in {city.name}"

    def generate_tour_description(self, hotel, city, country, meal_type, duration):
        return (
            f"Discover the beauty of {city.name}, {country.name}, with this {duration}-day tour. "
            f"Stay at the luxurious {hotel.name}, known for its {hotel.description or 'excellent service and amenities'}. "
            f"Enjoy {meal_type.type} meals during your stay and explore the vibrant culture and attractions of {city.name}. "
            f"This package is perfect for travelers seeking relaxation and adventure."
        )

    def handle(self, *args, **kwargs):
        meal_types = list(MealType.objects.all())
        cities = list(City.objects.all())

        tours_to_create = []

        for city in cities:
            for hotel in city.hotels.all():
                for meal_type in meal_types:
                    for duration in range(3, 15): 
                        if not Tour.objects.filter(
                            hotel=hotel,
                            meal_type=meal_type,
                            duration=duration
                        ).exists():
                            price = self.calculate_price(hotel, meal_type, duration)
                            name = self.generate_tour_name(hotel, city, duration)
                            description = self.generate_tour_description(
                                hotel, city, city.country, meal_type, duration
                            )

                            tours_to_create.append(Tour(
                                name=name,
                                description=description,
                                duration=duration,
                                price=price,
                                hotel=hotel,
                                meal_type=meal_type,
                            ))

        if tours_to_create:
            Tour.objects.bulk_create(tours_to_create)

        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(tours_to_create)} tours for all hotels, meal types, and durations.'))
