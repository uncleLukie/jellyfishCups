from flask import render_template, request, redirect, url_for, flash, jsonify
from app import app, db
from app.models import Cup, Order
from flask_mail import Mail, Message
import json
import os

# Configure Flask-Mail
app.config.update(
    MAIL_SERVER=os.environ.get("MAIL_SERVER", "smtp.example.com"),
    MAIL_PORT=os.environ.get("MAIL_PORT", 587),
    MAIL_USE_TLS=True,
    MAIL_USERNAME=os.environ.get("MAIL_USERNAME", "username"),
    MAIL_PASSWORD=os.environ.get("MAIL_PASSWORD", "password"),
)

mail = Mail(app)

@app.route("/")
def index():
    cups = Cup.query.all()
    return render_template("index.html", cups=cups)

@app.route("/add_cup", methods=["POST"])
def add_cup():
    # Add cup details from the form
    name = request.form["name"]
    price = request.form["price"]
    image_url = request.form["image_url"]

    cup = Cup(name=name, price=price, image_url=image_url)
    db.session.add(cup)
    db.session.commit()
    return redirect(url_for("index"))

@app.route("/remove_cup/<uuid:cup_id>", methods=["POST"])
def remove_cup(cup_id):
    cup = Cup.query.get(cup_id)
    db.session.delete(cup)
    db.session.commit()
    return redirect(url_for("index"))

@app.route("/checkout", methods=["POST"])
def checkout():
    items = json.loads(request.form["items"])
    email = request.form["email"]
    total_price = float(request.form["total_price"])

    # Save order to the database
    order = Order(email=email, items=json.dumps(items), total_price=total_price)
    db.session.add(order)
    db.session.commit()

    # Send email confirmation
    msg = Message(
        "JellyfishCups - Order Confirmation",
        sender=("JellyfishCups", "noreply@jellyfishcups.com"),
        recipients=[email],
    )
    msg.body = "Your order has been processed successfully!"
    mail.send(msg)

    return jsonify({"result": "success"})
