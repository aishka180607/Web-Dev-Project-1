from django.core.management.base import BaseCommand
from api.models import City, Flight
from django.utils import timezone
import random
from datetime import timedelta, datetime


class Command(BaseCommand):
    help = 'Generate realistic round-trip and connecting flights between cities with prices and schedules until August'

    def handle(self, *args, **kwargs):
        # Delete all existing flights
        Flight.objects.all().delete()
        self.stdout.write(self.style.WARNING('Deleted all existing flights.'))

        cities = list(City.objects.all())
        airlines = [
            {"name": "Air Astana", "icon": "https://ir.airastana.com/media/nihfojzd/logo-01-2x.png", "days": [0, 1, 2, 4, 5]},
            {"name": "Emirates", "icon": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/1200px-Emirates_logo.svg.png", "days": [0, 1, 2, 3, 4, 5, 6]},
            {"name": "Turkish Airlines", "icon": "https://logowik.com/content/uploads/images/thy-turkish-airlines-new6886.jpg", "days": [0, 1, 2, 3, 4, 5, 6]},
            {"name": "Lufthansa", "icon": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeOHLVuw7CBlCocxdWz6Nd8x2kzsSujChgFQ&s", "days": [0, 1, 3, 5]},
        ]

        realistic_routes = {
            "Kazakhstan": ["Turkey", "UAE", "Germany", "Qatar", "Kazakhstan"],
            "Turkey": ["Kazakhstan", "UAE", "Germany", "France", "Qatar", "USA", "Canada"],
            "UAE": ["Kazakhstan", "Turkey", "Qatar", "Germany", "France", "USA", "Canada", "Australia"],
            "Germany": ["Kazakhstan", "Turkey", "France", "USA", "UAE", "Qatar", "Canada", "Australia"],
            "France": ["Germany", "USA", "Canada", "Turkey", "UAE", "Qatar"],
            "USA": ["France", "Canada", "Germany", "UAE", "Turkey", "Qatar"],
            "Canada": ["USA", "France", "Germany", "UAE", "Turkey", "Qatar"],
            "Qatar": ["Kazakhstan", "Turkey", "UAE", "Germany", "France", "USA", "Canada", "Australia"],
            "Australia": ["UAE", "Germany", "Qatar"],
        }

        today = timezone.now().date()
        end_date = datetime(today.year, 6, 1).date()  # Generate flights until July 1st

        for origin in cities:
            for destination in cities:
                if origin == destination:
                    continue

                if origin.country.name not in realistic_routes or destination.country.name not in realistic_routes[origin.country.name]:
                    continue

                for airline in airlines:
                    current_date = today
                    while current_date <= end_date:
                        if current_date.weekday() in airline["days"]:
                            # Ensure 1 to 3 flights per day for this airline
                            num_flights = random.randint(1, 3)
                            for _ in range(num_flights):
                                departure_time = datetime.combine(current_date, datetime.min.time()) + timedelta(hours=random.randint(6, 22))
                                departure = timezone.make_aware(departure_time)
                                arrival = departure + timedelta(hours=random.randint(3, 12))
                                price = random.randint(100, 1000)

                                random_digits = f"{random.randint(1, 9999):04}"
                                Flight.objects.create(
                                    airline=airline["name"],
                                    flight_number=f"{airline['name'][:2].upper()}{random_digits}",
                                    departure=departure,
                                    arrival=arrival,
                                    origin=origin,
                                    destination=destination,
                                    icon=airline["icon"],
                                    price=price
                                )

                                # Generate return flight
                                return_departure = arrival + timedelta(days=random.randint(1, 7))
                                return_arrival = return_departure + timedelta(hours=random.randint(3, 12))
                                return_price = random.randint(100, 1000)
                                random_digits_return = f"{random.randint(1, 9999):04}"
                                Flight.objects.create(
                                    airline=airline["name"],
                                    flight_number=f"{airline['name'][:2].upper()}{random_digits_return}",
                                    departure=return_departure,
                                    arrival=return_arrival,
                                    origin=destination,
                                    destination=origin,
                                    icon=airline["icon"],
                                    price=return_price
                                )

                        current_date += timedelta(days=1)

        self.stdout.write(self.style.SUCCESS('Successfully generated flights until August!'))
