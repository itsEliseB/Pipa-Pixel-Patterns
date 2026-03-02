from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    designs = relationship("Design", back_populates="owner")


class Design(Base):
    __tablename__ = "designs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    pattern_type = Column(String, nullable=False, default="pixel_art")
    width = Column(Integer, nullable=False, default=32)
    height = Column(Integer, nullable=False, default=32)
    canvas_data = Column(Text, nullable=True)

    owner = relationship("User", back_populates="designs")
