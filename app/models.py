from app import db
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Cup(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=True)

class Order(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    email = db.Column(db.String(255), nullable=False)
    items = db.Column(db.String, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
