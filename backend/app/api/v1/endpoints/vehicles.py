from typing import List, Optional

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleResponse
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=List[VehicleResponse])
def get_vehicles(
    category: Optional[str] = None,
    transmission: Optional[str] = None,
    seats: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    fuel_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Vehicle).filter(Vehicle.is_available == True)

    if category:
        query = query.filter(Vehicle.category == category)
    if transmission:
        query = query.filter(Vehicle.transmission == transmission)
    if seats:
        query = query.filter(Vehicle.seats == seats)
    if min_price is not None:
        query = query.filter(Vehicle.price_per_day >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price_per_day <= max_price)
    if fuel_type:
        query = query.filter(Vehicle.fuel_type == fuel_type)

    return query.all()


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: str, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.post("/", response_model=VehicleResponse)
def create_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["owner", "admin", "super_admin"]:
        raise HTTPException(
            status_code=403,
            detail="Only vehicle owners or admins can register vehicles.",
        )

    db_vehicle = Vehicle(owner_id=current_user.id, **vehicle_in.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


@router.get("/owner/me", response_model=List[VehicleResponse])
def get_owner_vehicles(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["owner", "admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return db.query(Vehicle).filter(Vehicle.owner_id == current_user.id).all()


@router.delete("/{vehicle_id}")
def delete_vehicle(vehicle_id: str, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    db.delete(vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully"}
