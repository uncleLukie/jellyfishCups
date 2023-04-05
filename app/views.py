from flask import render_template, request, redirect, url_for, flash, jsonify, send_from_directory
from app import app, db
from app.models import Cup, Order, Aesthetic, TextColor
from flask_mail import Mail, Message
import json
import os
import paypalrestsdk

paypalrestsdk.configure({
    "mode": "sandbox",  # sandbox or live
    "client_id": {os.environ['PAYPAL_CLIENT_ID']},
    "client_secret": {os.environ["PAYPAL_CLIENT_SECRET"]}
})

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


@app.route('/api/check_stock', methods=['POST'])
def check_stock():
    items = request.json.get('items', [])
    out_of_stock_items = []

    for item in items:
        cup = Cup.query.get(item['cup_id'])

        if not cup:
            continue

        customizable = item['customizable'] == "true"

        if customizable:
            aesthetic = Aesthetic.query.get(item['aesthetic_id'])
            text_color = TextColor.query.get(item['text_color_id'])

            if cup.stock < item['quantity'] or aesthetic.stock < item['quantity'] or text_color.stock < item[
                'quantity']:
                out_of_stock_items.append({
                    'cup_id': cup.id,
                    'cup_name': cup.name,
                    'quantity': item['quantity'],
                })

        else:
            if cup.stock < item['quantity']:
                out_of_stock_items.append({
                    'cup_id': cup.id,
                    'cup_name': cup.name,
                    'quantity': item['quantity'],
                })

    if out_of_stock_items:
        return jsonify({'result': 'out_of_stock', 'out_of_stock_items': out_of_stock_items})

    return jsonify({'result': 'in_stock'})


@app.route("/api/checkout", methods=["GET", "POST"])
def checkout():
    if request.method == "POST":
        items = json.loads(request.form["items"])

        # Check stock for cups and their customizations
        out_of_stock_items = []
        for item in items:
            cup = Cup.query.get(item["cup_id"])

            if cup is None:
                return jsonify({"error": "Cup not found", "cup_id": item["cup_id"]}), 404

            if cup.stock < item["quantity"]:
                out_of_stock_items.append(item)

            if item["customizable"]:
                aesthetic = Aesthetic.query.get(item["aesthetic_id"])

                if aesthetic is None:
                    return jsonify({"error": "Aesthetic not found", "aesthetic_id": item["aesthetic_id"]}), 404

                text_color = TextColor.query.get(item["text_color_id"])

                if text_color is None:
                    return jsonify({"error": "Text color not found", "text_color_id": item["text_color_id"]}), 404

                if aesthetic.stock < item["quantity"] or text_color.stock < item["quantity"]:
                    out_of_stock_items.append(item)

        if out_of_stock_items:
            return jsonify({"result": "out_of_stock", "out_of_stock_items": out_of_stock_items})

        return render_template("checkout.html", items=items)

    return render_template("checkout.html")


@app.route("/api/process_order", methods=["POST"])
def process_order():
    try:
        items = json.loads(request.form["items"])
        email = request.form["email"]
        total_price = float(request.form["total_price"])

        # Create a PayPal payment
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"},
            "redirect_urls": {
                "return_url": "http://localhost:5000/payment/execute",
                "cancel_url": "http://localhost:5000/"},
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "JellyfishCups Order",
                        "sku": "order",
                        "price": total_price,
                        "currency": "USD",
                        "quantity": 1}]},
                "amount": {
                    "total": total_price,
                    "currency": "USD"},
                "description": "JellyfishCups Order"}]})

        if payment.create():
            for link in payment.links:
                if link.rel == "approval_url":
                    approval_url = link.href
                    return redirect(approval_url)
        else:
            return jsonify({"result": "error", "message": "Error creating PayPal payment."})

    except Exception as e:
        app.logger.exception(e)
        return jsonify({"result": "error", "message": str(e)}), 500


@app.route("/api/payment/execute", methods=["GET"])
def execute_payment():
    try:
        payment_id = request.args.get("paymentId")
        payer_id = request.args.get("PayerID")

        payment = paypalrestsdk.Payment.find(payment_id)

        if payment.execute({"payer_id": payer_id}):
            # Save order to the database
            items = json.loads(payment.transactions[0].item_list.items[0].sku)
            email = payment.payer.payer_info.email
            total_price = float(payment.transactions[0].amount.total)

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

            return render_template("success.html")
        else:
            return jsonify({"result": "error", "message": "Error executing PayPal payment."})

    except Exception as e:
        app.logger.exception(e)
        return jsonify({"result": "error", "message": str(e)}), 500


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
    return jsonify(cup_list)


@app.route('/api/aesthetics', methods=['GET'])
def get_aesthetics():
    aesthetics = Aesthetic.query.all()
    aesthetic_data = [
        {'id': aesthetic.id, 'name': aesthetic.name, 'price': aesthetic.price, 'image_url': aesthetic.image_url,
         'stock': aesthetic.stock} for aesthetic in aesthetics]

    return jsonify(aesthetic_data)


@app.route('/api/text_colors', methods=['GET'])
def get_text_colors():
    text_colors = TextColor.query.all()
    text_color_data = [
        {'id': text_color.id, 'color': text_color.color, 'price': text_color.price, 'image_url': text_color.image_url,
         'stock': text_color.stock} for text_color in text_colors]

    return jsonify(text_color_data)