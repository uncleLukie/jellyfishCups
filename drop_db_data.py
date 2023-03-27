from app import db, app
from app.models import Cup, Aesthetic, TextColor

with app.app_context():
    # Delete existing data
    Cup.query.delete()
    Aesthetic.query.delete()
    TextColor.query.delete()

    # Commit the changes
    db.session.commit()

print("Data has been deleted from Cup, Aesthetic, and TextColor tables.")
