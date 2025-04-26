from rest_framework import serializers
from .models import Application, City, Flight, Hotel, Tour, Country,CustomRequest, MealType

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'image', 'created_at', 'updated_at']

class CitySerializer(serializers.ModelSerializer):
    country = CountrySerializer(read_only=True)  # Include nested country details
    class Meta:
        model = City
        fields = ['id', 'name', 'country', 'images', 'created_at', 'updated_at']

class HotelSerializer(serializers.ModelSerializer):
    city = CitySerializer(read_only=True)  # Include nested city details
    class Meta:
        model = Hotel
        fields = ['id', 'name', 'city', 'address', 'rating', 'description', 'images', 'created_at', 'updated_at']

class TourSerializer(serializers.ModelSerializer):
    hotel = HotelSerializer(read_only=True)  # Include nested hotel details
    meal_type = serializers.CharField(source='meal_type.description', read_only=True)  # Include meal type details
    class Meta:
        model = Tour
        fields = ['id', 'name', 'hotel', 'price', 'meal_type', 'duration','description', 'created_at', 'updated_at']

class FlightSerializer(serializers.ModelSerializer):
    origin_id = serializers.IntegerField(source='origin.id', read_only=True)  # Include origin_id
    destination_id = serializers.IntegerField(source='destination.id', read_only=True)  # Include destination_id
    origin = CitySerializer(read_only=True)  # Include nested origin city details
    destination = CitySerializer(read_only=True)  # Include nested destination city details

    class Meta:
        model = Flight
        fields = ['id', 'airline', 'flight_number', 'departure', 'arrival', 'origin', 'destination', 'origin_id', 'destination_id','price', 'icon', 'created_at', 'updated_at']

class ApplicationSerializer(serializers.ModelSerializer):
    flights_to = serializers.PrimaryKeyRelatedField(
        queryset=Flight.objects.all(), many=True, required=False
    )
    flights_back = serializers.PrimaryKeyRelatedField(
        queryset=Flight.objects.all(), many=True, required=False
    )

    class Meta:
        model = Application
        fields = [
            'id', 'name', 'email', 'phone', 'tour', 'flights_to', 'flights_back',
            'total_price', 'status', 'created_at', 'updated_at'
        ]



class CustomRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomRequest 
        fields = ['name', 'email', 'message', 'created_at', 'updated_at']

class MealTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealType
        fields = ['id', 'type', 'description', 'created_at', 'updated_at']