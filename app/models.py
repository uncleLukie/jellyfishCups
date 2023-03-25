from app import db
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Aesthetic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)

class TextOption(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    color = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)

# Add relationships to the Cup model
class Cup(db.Model):
    # ...
    aesthetic_id = db.Column(db.Integer, db.ForeignKey("aesthetic.id"))
    aesthetic = db.relationship("Aesthetic")

    text_option_id = db.Column(db.Integer, db.ForeignKey("text_option.id"))
    text_option = db.relationship("TextOption")

    text_content = db.Column(db.String(50), nullable=True)

    def serialize(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "price": self.price,
            "image_url": self.image_url,
        }

class Order(db.Model):
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    email = db.Column(db.String(255), nullable=False)
    items = db.Column(db.String, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
