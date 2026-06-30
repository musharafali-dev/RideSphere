import uuid
from app.domain.entities.ride import Ride
from app.domain.value_objects.location import Location
from app.domain.services.pricing_service import PricingService
from app.domain.repositories.ride_repo import RideRepository
from app.domain.events.ride_events import RideRequested
from app.infrastructure.messaging.redis_pubsub import RedisEventBus

class RequestRideUseCase:
    def __init__(self, ride_repo: RideRepository, pricing_service: PricingService, event_bus: RedisEventBus):
        self.ride_repo = ride_repo
        self.pricing_service = pricing_service
        self.event_bus = event_bus

    async def execute(self, rider_id: uuid.UUID, pickup_lat: float, pickup_lon: float, 
                      dest_lat: float, dest_lon: float) -> Ride:
        pickup = Location(pickup_lat, pickup_lon)
        destination = Location(dest_lat, dest_lon)
        
        # Calculate estimated fare
        estimated_fare = self.pricing_service.estimate_fare(pickup, destination)
        
        ride = Ride(
            rider_id=rider_id,
            pickup_location=pickup,
            destination_location=destination,
            estimated_fare=estimated_fare
        )

        await self.ride_repo.save(ride)
        
        # Publish RideRequested event
        event = RideRequested(
            ride_id=ride.id,
            rider_id=ride.rider_id,
            pickup_lat=pickup.latitude,
            pickup_lon=pickup.longitude,
            dest_lat=destination.latitude,
            dest_lon=destination.longitude,
            estimated_fare=estimated_fare
        )
        await self.event_bus.publish("ride_events", event)

        # Trigger Celery driver matching task
        from app.infrastructure.tasks.ride_matching_tasks import trigger_driver_matching
        trigger_driver_matching.delay(str(ride.id))

        return ride
