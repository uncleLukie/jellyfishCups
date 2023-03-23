from app import db, app
from app.models import Cup

with app.app_context():
    cups = Cup.query.all()

    if cups:
        print("Cups in the database:")
        for cup in cups:
            print(f"ID: {cup.id}, Name: {cup.name}, Price: {cup.price}, Image URL: {cup.image_url}")
    else:
        print("No cups found in the database.")
