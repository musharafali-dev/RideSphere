from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TourBase(BaseModel):
    title: str
    description: str
    price: float
    duration_days: int
    itinerary: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = True


class TourCreate(TourBase):
    pass


class TourResponse(TourBase):
    id: str
    operator_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
