from app.core.security import get_password_hash
from app.db.session import Base, SessionLocal, engine
from app.models.tour import Tour
from app.models.user import User
from app.models.vehicle import Vehicle
from sqlalchemy.orm import Session


def seed_db():
    print("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    print("Seeding database...")

    # Passwords
    hashed_pw = get_password_hash("password123")

    # 1. Seed 3 Admins
    admins = []
    for i in range(1, 4):
        admin = User(
            email=f"admin{i}@ridesphere.com",
            hashed_password=hashed_pw,
            full_name=f"Admin Master {i}",
            role="admin",
            is_verified=True,
            wallet_balance=1000.0,
        )
        db.add(admin)
        admins.append(admin)

    # 2. Seed 10 Owners
    owners = []
    for i in range(1, 11):
        owner = User(
            email=f"owner{i}@ridesphere.com",
            hashed_password=hashed_pw,
            full_name=f"Fleet Owner {i}",
            role="owner",
            is_verified=True,
            wallet_balance=150.0 * i,
        )
        db.add(owner)
        owners.append(owner)

    # 3. Seed 20 Customers
    customers = []
    for i in range(1, 21):
        customer = User(
            email=f"customer{i}@ridesphere.com",
            hashed_password=hashed_pw,
            full_name=f"Customer User {i}",
            role="customer",
            is_verified=True,
            wallet_balance=350.0 * i,
        )
        db.add(customer)
        customers.append(customer)

    # 4. Seed 15 Drivers
    drivers = []
    for i in range(1, 16):
        driver = User(
            email=f"driver{i}@ridesphere.com",
            hashed_password=hashed_pw,
            full_name=f"Chauffeur Driver {i}",
            role="driver",
            is_verified=True,
            license_number=f"DL-PK-998822{i}",
            wallet_balance=50.0 * i,
        )
        db.add(driver)
        drivers.append(driver)

    # 5. Seed 5 Tour Operators
    operators = []
    for i in range(1, 6):
        operator = User(
            email=f"operator{i}@ridesphere.com",
            hashed_password=hashed_pw,
            full_name=f"Tour Operator {i}",
            role="operator",
            is_verified=True,
            wallet_balance=800.0 * i,
        )
        db.add(operator)
        operators.append(operator)

    db.commit()

    # Refresh owners to get IDs
    for o in owners:
        db.refresh(o)

    # 6. Seed 20+ Vehicles mapping to Owners
    # Unsplash professional car/bike/bus/touring images
    vehicles_data = [
        # Economy Cars
        {
            "category": "car_rental",
            "make": "Toyota",
            "model": "Corolla",
            "year": 2022,
            "color": "Silver",
            "license_plate": "LEC-5566",
            "price_per_day": 40.0,
            "price_per_hour": 6.0,
            "seats": 5,
            "transmission": "automatic",
            "fuel_type": "hybrid",
            "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "car_rental",
            "make": "Honda",
            "model": "Civic",
            "year": 2023,
            "color": "White",
            "license_plate": "LEB-1122",
            "price_per_day": 45.0,
            "price_per_hour": 8.0,
            "seats": 5,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "car_rental",
            "make": "Honda",
            "model": "BRV",
            "year": 2022,
            "color": "Silver",
            "license_plate": "LHE-3990",
            "price_per_day": 55.0,
            "price_per_hour": 9.0,
            "seats": 7,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80",
        },
        # SUVs
        {
            "category": "car_rental",
            "make": "Toyota",
            "model": "Prado",
            "year": 2021,
            "color": "Black",
            "license_plate": "SUV-4455",
            "price_per_day": 180.0,
            "price_per_hour": 25.0,
            "seats": 7,
            "transmission": "automatic",
            "fuel_type": "diesel",
            "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "car_rental",
            "make": "Toyota",
            "model": "Fortuner",
            "year": 2022,
            "color": "Bronze",
            "license_plate": "FTN-1290",
            "price_per_day": 150.0,
            "price_per_hour": 22.0,
            "seats": 7,
            "transmission": "automatic",
            "fuel_type": "diesel",
            "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
        },
        # Luxury Cars
        {
            "category": "luxury",
            "make": "BMW",
            "model": "X5",
            "year": 2022,
            "color": "Deep Blue",
            "license_plate": "VIP-999",
            "price_per_day": 220.0,
            "price_per_hour": 30.0,
            "seats": 5,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "luxury",
            "make": "BMW",
            "model": "7 Series",
            "year": 2023,
            "color": "Black",
            "license_plate": "VIP-777",
            "price_per_day": 350.0,
            "price_per_hour": 50.0,
            "seats": 5,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "luxury",
            "make": "Mercedes-Benz",
            "model": "E Class",
            "year": 2022,
            "color": "Silver",
            "license_plate": "VIP-555",
            "price_per_day": 280.0,
            "price_per_hour": 40.0,
            "seats": 5,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "luxury",
            "make": "Audi",
            "model": "A6",
            "year": 2022,
            "color": "White",
            "license_plate": "AUD-6622",
            "price_per_day": 260.0,
            "price_per_hour": 35.0,
            "seats": 5,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "luxury",
            "make": "Porsche",
            "model": "911 Carrera",
            "year": 2023,
            "color": "Red",
            "license_plate": "SPD-911",
            "price_per_day": 450.0,
            "price_per_hour": 60.0,
            "seats": 2,
            "transmission": "automatic",
            "fuel_type": "octane",
            "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "luxury",
            "make": "Lexus",
            "model": "LX600",
            "year": 2023,
            "color": "Black",
            "license_plate": "LEX-600",
            "price_per_day": 400.0,
            "price_per_hour": 55.0,
            "seats": 7,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "luxury",
            "make": "Toyota",
            "model": "Land Cruiser ZX",
            "year": 2023,
            "color": "Pearl White",
            "license_plate": "LC-300",
            "price_per_day": 380.0,
            "price_per_hour": 50.0,
            "seats": 7,
            "transmission": "automatic",
            "fuel_type": "diesel",
            "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80",
        },
        # City Bikes & Touring Bikes
        {
            "category": "bike_rental",
            "make": "Yamaha",
            "model": "MT-15",
            "year": 2022,
            "color": "Cyan",
            "license_plate": "MTR-8844",
            "price_per_day": 30.0,
            "price_per_hour": 4.5,
            "seats": 2,
            "transmission": "manual",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bike_rental",
            "make": "Kawasaki",
            "model": "Ninja 650",
            "year": 2021,
            "color": "Lime Green",
            "license_plate": "SPD-650",
            "price_per_day": 70.0,
            "price_per_hour": 12.0,
            "seats": 2,
            "transmission": "manual",
            "fuel_type": "octane",
            "image_url": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bike_rental",
            "make": "Honda",
            "model": "Gold Wing GL1800",
            "year": 2020,
            "color": "Deep Gold",
            "license_plate": "GW-1800",
            "price_per_day": 110.0,
            "price_per_hour": 18.0,
            "seats": 2,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bike_rental",
            "make": "Suzuki",
            "model": "GSX-R600",
            "year": 2021,
            "color": "Blue / White",
            "license_plate": "SUZ-600",
            "price_per_day": 65.0,
            "price_per_hour": 10.0,
            "seats": 2,
            "transmission": "manual",
            "fuel_type": "octane",
            "image_url": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bike_rental",
            "make": "Yamaha",
            "model": "YZF-R1",
            "year": 2022,
            "color": "Racing Blue",
            "license_plate": "MTR-9901",
            "price_per_day": 130.0,
            "price_per_hour": 20.0,
            "seats": 2,
            "transmission": "manual",
            "fuel_type": "octane",
            "image_url": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bike_rental",
            "make": "BMW",
            "model": "S1000RR",
            "year": 2023,
            "color": "Motorsport Red",
            "license_plate": "MTR-7722",
            "price_per_day": 150.0,
            "price_per_hour": 25.0,
            "seats": 2,
            "transmission": "manual",
            "fuel_type": "octane",
            "image_url": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bike_rental",
            "make": "Harley-Davidson",
            "model": "Iron 883",
            "year": 2021,
            "color": "Matte Black",
            "license_plate": "HD-883",
            "price_per_day": 95.0,
            "price_per_hour": 15.0,
            "seats": 1,
            "transmission": "manual",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bike_rental",
            "make": "Vespa",
            "model": "Primavera 150",
            "year": 2022,
            "color": "Pastel Yellow",
            "license_plate": "VSP-150",
            "price_per_day": 25.0,
            "price_per_hour": 3.5,
            "seats": 2,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bike_rental",
            "make": "Honda",
            "model": "CB500X",
            "year": 2022,
            "color": "Grand Prix Red",
            "license_plate": "MTR-500",
            "price_per_day": 55.0,
            "price_per_hour": 8.0,
            "seats": 2,
            "transmission": "manual",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bike_rental",
            "make": "Ducati",
            "model": "Scrambler Icon",
            "year": 2022,
            "color": "Yellow",
            "license_plate": "DCT-803",
            "price_per_day": 85.0,
            "price_per_hour": 12.0,
            "seats": 2,
            "transmission": "manual",
            "fuel_type": "octane",
            "image_url": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80",
        },
        # Buses & Coasters
        {
            "category": "bus_coaster",
            "make": "Toyota",
            "model": "Coaster VIP",
            "year": 2021,
            "color": "White",
            "license_plate": "BUS-5566",
            "price_per_day": 150.0,
            "price_per_hour": 25.0,
            "seats": 29,
            "transmission": "manual",
            "fuel_type": "diesel",
            "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bus_coaster",
            "make": "Hyundai",
            "model": "Universe Bus",
            "year": 2019,
            "color": "Red / White",
            "license_plate": "BUS-9900",
            "price_per_day": 280.0,
            "price_per_hour": 40.0,
            "seats": 45,
            "transmission": "manual",
            "fuel_type": "diesel",
            "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bus_coaster",
            "make": "Kia",
            "model": "Grand Carnival",
            "year": 2022,
            "color": "Pearl Black",
            "license_plate": "BUS-2990",
            "price_per_day": 90.0,
            "price_per_hour": 15.0,
            "seats": 11,
            "transmission": "automatic",
            "fuel_type": "diesel",
            "image_url": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bus_coaster",
            "make": "Mercedes-Benz",
            "model": "Sprinter VIP",
            "year": 2022,
            "color": "Jet Black",
            "license_plate": "BUS-8899",
            "price_per_day": 160.0,
            "price_per_hour": 25.0,
            "seats": 15,
            "transmission": "automatic",
            "fuel_type": "diesel",
            "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bus_coaster",
            "make": "Toyota",
            "model": "HiAce Grand Cabin",
            "year": 2021,
            "color": "Silver",
            "license_plate": "BUS-4112",
            "price_per_day": 85.0,
            "price_per_hour": 12.5,
            "seats": 14,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bus_coaster",
            "make": "Ford",
            "model": "Transit Van",
            "year": 2022,
            "color": "White",
            "license_plate": "BUS-3390",
            "price_per_day": 95.0,
            "price_per_hour": 14.0,
            "seats": 15,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bus_coaster",
            "make": "Volvo",
            "model": "9700 Tour Bus",
            "year": 2020,
            "color": "Silver",
            "license_plate": "BUS-9700",
            "price_per_day": 350.0,
            "price_per_hour": 50.0,
            "seats": 50,
            "transmission": "automatic",
            "fuel_type": "diesel",
            "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bus_coaster",
            "make": "Scania",
            "model": "Touring Coach",
            "year": 2021,
            "color": "Ocean Blue",
            "license_plate": "BUS-7700",
            "price_per_day": 380.0,
            "price_per_hour": 55.0,
            "seats": 49,
            "transmission": "automatic",
            "fuel_type": "diesel",
            "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bus_coaster",
            "make": "Hyundai",
            "model": "H1 Royale",
            "year": 2020,
            "color": "Pearl White",
            "license_plate": "BUS-1122",
            "price_per_day": 75.0,
            "price_per_hour": 10.0,
            "seats": 12,
            "transmission": "automatic",
            "fuel_type": "petrol",
            "image_url": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80",
        },
        {
            "category": "bus_coaster",
            "make": "Toyota",
            "model": "Coaster Standard",
            "year": 2020,
            "color": "Beige / White",
            "license_plate": "BUS-2233",
            "price_per_day": 130.0,
            "price_per_hour": 20.0,
            "seats": 29,
            "transmission": "manual",
            "fuel_type": "diesel",
            "image_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
        },
        # Electric Vehicles
        {
            "category": "car_rental",
            "make": "Tesla",
            "model": "Model 3",
            "year": 2022,
            "color": "Midnight Silver",
            "license_plate": "EV-333",
            "price_per_day": 120.0,
            "price_per_hour": 16.0,
            "seats": 5,
            "transmission": "automatic",
            "fuel_type": "electric",
            "image_url": "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80",
        },
    ]

    for idx, v_data in enumerate(vehicles_data):
        owner_id = owners[idx % len(owners)].id
        vehicle = Vehicle(
            owner_id=owner_id,
            category=v_data["category"],
            make=v_data["make"],
            model=v_data["model"],
            year=v_data["year"],
            color=v_data["color"],
            license_plate=v_data["license_plate"],
            price_per_day=v_data["price_per_day"],
            price_per_hour=v_data["price_per_hour"],
            seats=v_data["seats"],
            transmission=v_data["transmission"],
            fuel_type=v_data["fuel_type"],
            image_url=v_data["image_url"],
            is_available=True,
        )
        db.add(vehicle)

    # 7. Seed 6 Tours
    tours = [
        Tour(
            title="Hunza Valley Adventure",
            description="Embark on a premium 7-day tour across Hunza Valley, Karimabad, Altit/Baltit Forts, and Attabad Lake.",
            price=399.0,
            duration_days=7,
            itinerary="Day 1: Travel to Chilas via Naran Babusar. Day 2: Journey to Karimabad. Day 3: Altit Baltit forts. Day 4: Excursion to Khunjerab Pass. Day 5: Attabad lake boating. Day 6: Travel back to Besham. Day 7: Return to Islamabad.",
            image_url="https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80",
            is_active=True,
        ),
        Tour(
            title="Skardu Expedition",
            description="Explore Cold Desert, Shangrila Resort, Lower Kachura, and the majestic Deosai Plains on a luxury 5-day tour.",
            price=450.0,
            duration_days=5,
            itinerary="Day 1: Fly to Skardu, visit Shangrila. Day 2: Trek to Basho Valley. Day 3: Day trip to Deosai Plains. Day 4: Explore Shigar Fort. Day 5: Fly back to Islamabad.",
            image_url="https://images.unsplash.com/photo-1588096344356-9b6d80c059c2?auto=format&fit=crop&w=600&q=80",
            is_active=True,
        ),
        Tour(
            title="Fairy Meadows Tour",
            description="A thrilling 4-day jeep track and hiking tour to the foot of Nanga Parbat killer mountain.",
            price=299.0,
            duration_days=4,
            itinerary="Day 1: Travel to Raikot Bridge. Day 2: Jeep trek and hike to Fairy Meadows. Day 3: Excursion to Nanga Parbat Base Camp. Day 4: Return hike and travel back.",
            image_url="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
            is_active=True,
        ),
        Tour(
            title="Lahore Cultural Tour",
            description="A premium 2-day historical sightseeing tour including Badshahi Mosque, Walled City, and Wagah Border.",
            price=99.0,
            duration_days=2,
            itinerary="Day 1: Badshahi Mosque, Lahore Fort, Wazir Khan Mosque, Food Street dinner. Day 2: Shalimar Gardens and Wagah Border ceremony.",
            image_url="https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=600&q=80",
            is_active=True,
        ),
        Tour(
            title="Islamabad Heritage Tour",
            description="A clean 1-day heritage journey through Faisal Mosque, Lok Virsa museum, and lunch at Monal Restaurant.",
            price=49.0,
            duration_days=1,
            itinerary="Morning: Faisal Mosque & Lok Virsa. Afternoon: Daman-e-Koh. Evening: Monal Margalla Hills sunset dinner.",
            image_url="https://images.unsplash.com/photo-1595181134015-89689b657476?auto=format&fit=crop&w=600&q=80",
            is_active=True,
        ),
        Tour(
            title="Naran Kaghan Tour",
            description="Experience a 3-day getaway to Lake Saiful Muluk, Babusar Top, and Siri Paye Meadows.",
            price=199.0,
            duration_days=3,
            itinerary="Day 1: Travel to Naran, explore Rafting site. Day 2: Jeep tour to Lake Saiful Muluk. Day 3: Travel back to Islamabad.",
            image_url="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
            is_active=True,
        ),
    ]

    for t in tours:
        db.add(t)

    db.commit()
    db.close()
    print("Database seeding completed successfully.")


if __name__ == "__main__":
    seed_db()
