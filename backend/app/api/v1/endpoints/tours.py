from typing import List

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.tour import Tour
from app.models.user import User
from app.schemas.tour import TourCreate, TourResponse
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=List[TourResponse])
def get_tours(db: Session = Depends(get_db)):
    return db.query(Tour).filter(Tour.is_active == True).all()


@router.get("/{tour_id}", response_model=TourResponse)
def get_tour(tour_id: str, db: Session = Depends(get_db)):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    return tour


@router.post("/", response_model=TourResponse)
def create_tour(
    tour_in: TourCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role not in ["operator", "admin", "super_admin"]:
        raise HTTPException(
            status_code=403, detail="Only tour operators or admins can create tours."
        )
    db_tour = Tour(operator_id=current_user.id, **tour_in.dict())
    db.add(db_tour)
    db.commit()
    db.refresh(db_tour)
    return db_tour


@router.delete("/{tour_id}")
def delete_tour(tour_id: str, db: Session = Depends(get_db)):
    tour = db.query(Tour).filter(Tour.id == tour_id).first()
    if not tour:
        raise HTTPException(status_code=404, detail="Tour not found")
    db.delete(tour)
    db.commit()
    return {"message": "Tour deleted successfully"}
