from flask import render_template, request, redirect, url_for, flash, jsonify, send_from_directory
from app import app, db
from app.models import Cup, Order, Aesthetic, TextColor
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


@app.route('/api/cups', methods=['GET'])
def get_cups():
    cups = Cup.query.all()
    cup_list = []
    for cup in cups:
        cup_list.append({
            'id': cup.id,
            'name': cup.name,
            'price': cup.price,
            'image_url': cup.image_url,
            'customizable': cup.customizable,
            'stock': cup.stock
        })
    return jsonify({'cups': cup_list})


@app.route('/api/aesthetics', methods=['GET'])
def get_aesthetics():
    aesthetics = Aesthetic.query.all()
    aesthetic_data = [
        {'id': aesthetic.id, 'name': aesthetic.name, 'price': aesthetic.price, 'image_url': aesthetic.image_url,
         'stock': aesthetic.stock} for aesthetic in aesthetics]

    return jsonify({"aesthetics": aesthetic_data})


@app.route('/api/text_colors', methods=['GET'])
def get_text_colors():
    text_colors = TextColor.query.all()
    text_color_data = [
        {'id': text_color.id, 'color': text_color.color, 'price': text_color.price, 'image_url': text_color.image_url,
         'stock': text_color.stock} for text_color in text_colors]

    return jsonify({"text_colors": text_color_data})
