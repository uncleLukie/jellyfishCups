from app import db, app
from app.models import Cup, Aesthetic, TextColor

dummy_cups = [
    {
        'name': 'Blue Jellyfish Cup',
        'price': 12.99,
        'image_url': 'https://i.etsystatic.com/27537437/r/il/3613b7/3232071911/il_1588xN.3232071911_9l46.jpg',
        'customizable': True,
    },
    {
        'name': 'Red Jellyfish Cup',
        'price': 14.98,
        'image_url': 'https://i.etsystatic.com/30374348/r/il/6cadca/3234313411/il_fullxfull.3234313411_kvyw.jpg',
        'customizable': True,
    },
    {
        'name': 'Green Jellyfish Cup',
        'price': 13.99,
        'image_url': 'https://i.etsystatic.com/15619823/r/il/83edd6/3080652390/il_fullxfull.3080652390_c217.jpg',
        'customizable': False,
    },
]

dummy_aesthetics = [
    {
        'name': 'Floral Bloom',
        'price': 9.99,
        'image_url': 'https://i.etsystatic.com/23033567/r/il/413ff7/2762657183/il_1140xN.2762657183_qa85.jpg',
    },
    {
        'name': 'Butterfly Flutter',
        'price': 10.0,
        'image_url': 'https://i.pinimg.com/originals/a1/b3/e7/a1b3e7b372259a331de83cc993f5f842.jpg',
    },
]

dummy_text_colors = [
    {
        'color': 'Rose Gold',
        'price': 10.0,
        'image_url': 'https://i.etsystatic.com/21695415/r/il/3f5849/2542822188/il_1140xN.2542822188_ifnu.jpg',
    },
    {
        'color': 'Black',
        'price': 9.50,
        'image_url': 'https://i.etsystatic.com/22304405/r/il/798425/3629356758/il_794xN.3629356758_hrra.jpg',
    },
]

with app.app_context():
    db.create_all()
    db.session.commit()

    # Delete existing data
    Cup.query.delete()
    Aesthetic.query.delete()
    TextColor.query.delete()
    db.session.commit()

    # Insert dummy cups into the database
    for cup_data in dummy_cups:
        cup = Cup(name=cup_data['name'], price=cup_data['price'], image_url=cup_data['image_url'])
        db.session.add(cup)

    # Insert dummy aesthetics into the database
    for aesthetic_data in dummy_aesthetics:
        aesthetic = Aesthetic(name=aesthetic_data['name'], price=aesthetic_data['price'], image_url=aesthetic_data['image_url'])
        db.session.add(aesthetic)

    # Insert dummy text colors into the database
    for text_color_data in dummy_text_colors:
        text_color = TextColor(color=text_color_data['color'], price=text_color_data['price'], image_url=text_color_data['image_url'])
        db.session.add(text_color)

    db.session.commit()
    print("Existing data has been deleted and new dummy data has been added to the database.")
