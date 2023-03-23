from app import db, app
from app.models import Cup

dummy_cups = [
    {
        'name': 'Blue Jellyfish Cup',
        'price': 12.99,
        'image_url': 'https://i.etsystatic.com/27537437/r/il/3613b7/3232071911/il_1588xN.3232071911_9l46.jpg',
    },
    {
        'name': 'Red Jellyfish Cup',
        'price': 14.99,
        'image_url': 'https://i.etsystatic.com/30374348/r/il/6cadca/3234313411/il_fullxfull.3234313411_kvyw.jpg',
    },
    {
        'name': 'Green Jellyfish Cup',
        'price': 13.99,
        'image_url': 'https://i.etsystatic.com/15619823/r/il/83edd6/3080652390/il_fullxfull.3080652390_c217.jpg',
    },
]


with app.app_context():
    db.create_all()
    db.session.commit()

    # Check if there are already dummy cups in the database
    if not Cup.query.first():
        # Insert dummy cups into the database
        for cup_data in dummy_cups:
            cup = Cup(name=cup_data['name'], price=cup_data['price'], image_url=cup_data['image_url'])
            db.session.add(cup)

        db.session.commit()
        print("Dummy data has been added to the database.")
    else:
        print("Database already contains data. No dummy data was added.")