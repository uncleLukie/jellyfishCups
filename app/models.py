from app import db
from sqlalchemy.dialects.postgresql import UUID
import uuid

class Aesthetic(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)

class Text(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    color = db.Column(db.String(50), nullable=False)
    text_content = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)

class Cup(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255), nullable=False)

    def serialize(self):
        return {
            "id": str(self.id),
            "name": self.name,
            "price": self.price,
            "image_url": self.image_url,
        }

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    ticket_number = db.Column(db.String(100), unique=True, nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    address_line1 = db.Column(db.String(255), nullable=False)
    address_line2 = db.Column(db.String(255), nullable=True)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    cup_id = db.Column(db.Integer, db.ForeignKey('cup.id'), nullable=False)
    aesthetic_id = db.Column(db.Integer, db.ForeignKey('aesthetic.id'), nullable=False)
    text_id = db.Column(db.Integer, db.ForeignKey('text.id'), nullable=False)
    cup = db.relationship('Cup')
    aesthetic = db.relationship('Aesthetic')
    text = db.relationship('Text')
