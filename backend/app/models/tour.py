import uuid
from datetime import datetime

from app.db.session import Base
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String
from sqlalchemy.orm import relationship


class Tour(Base):
    __tablename__ = "tours"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    operator_id = Column(String, nullable=True)  # Optional operator reference
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    duration_days = Column(Integer, nullable=False, default=1)
    itinerary = Column(String, nullable=True)  # Text itinerary or list description
    image_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    bookings = relationship("Booking", back_populates="tour")
