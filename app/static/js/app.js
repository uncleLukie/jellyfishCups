import {
    fetchCups, getCupById, openCustomizationModal,
    populateCups, fetchTextColors, fetchAesthetics, cups
} from './modules/cup.js';
import {addToCart, populateCart, showCart, clearCart} from './modules/cart.js';
import {handleCheckout} from './modules/checkout.js';


let aesthetics = [];
let text_colors = [];
let selectedCup = null;

$(document).ready(function () {
    let $aestheticSelector = $("#aesthetic-selector");
    let $textColorSelector = $("#text-color-selector");
    let $cartItems = $("#cart-items");

    // Event listener for "Add to Cart" buttons
    $("#cups-container").on("click", ".add-to-cart", function () {
        let cupId = $(this).data("cup-id");
        let cup = getCupById(cupId, cups);

        if (cup.customizable) {
            selectedCup = cup;
            openCustomizationModal(aesthetics, text_colors);
        } else {
            addToCart(cupId);
        }
    });

    // Event listener for the "Checkout" button
    $("#checkout-button").click(function () {
        handleCheckout();
    });

    $("#view-cart-button").on("click", function () {
        showCart();
    });

    $aestheticSelector.on("change", function () {
        let selectedAesthetic = $(this).find("option:selected");
        let imageUrl = selectedAesthetic.data("image");
        $("#aesthetic-preview").attr("src", imageUrl).show();
    });

    $textColorSelector.on("change", function () {
        let selectedTextColor = $(this).find("option:selected");
        let imageUrl = selectedTextColor.data("image");
        $("#text-color-preview").attr("src", imageUrl).show();
    });


    $("#save-customization").on("click", function () {
        let cup = selectedCup;
        let selectedAesthetic = $("#aesthetic-selector option:selected");
        let selectedTextColor = $("#text-color-selector option:selected");
        let textContent = $("#text-content").val();

        let aestheticPrice = parseFloat(selectedAesthetic.text().match(/\(([^)]+)\)/)[1]);
        let textColorPrice = parseFloat(selectedTextColor.text().match(/\(([^)]+)\)/)[1]);
        let totalPrice = cup.price + aestheticPrice + textColorPrice;

        cup.aesthetic_id = parseInt(selectedAesthetic.val());
        cup.aesthetic = {
            name: selectedAesthetic.text(),
            image_url: selectedAesthetic.data("image"),
            price: aestheticPrice
        };
        cup.text_color_id = parseInt(selectedTextColor.val());
        cup.text_color = {
            name: selectedTextColor.text(),
            image_url: selectedTextColor.data("image"),
            price: textColorPrice
        };
        cup.text_content = textContent;
        cup.total_price = totalPrice;

        addToCart(cup.id, cup);
        $("#customizationModal").modal("hide");
    });

    $("#clear-cart-button").on("click", function () {
        clearCart();
    });

    $cartItems
        .on("click", ".plus", function () {
            let index = $(this).closest("li").index();
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart[index].quantity++;
            localStorage.setItem("cart", JSON.stringify(cart));
            showCart();
        })

        .on("click", ".minus", function () {
            let index = $(this).closest("li").index();
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart[index].quantity--;

            if (cart[index].quantity === 0) {
                cart.splice(index, 1);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            showCart();

        })
    $cartItems.on("click", ".update-quantity", function () {
        let cupId = $(this).data("cup-id");
        let action = $(this).data("action");
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existingCartItem = cart.find((item) => item.id === cupId && !item.customized);

        if (existingCartItem) {
            if (action === "increment") {
                existingCartItem.quantity++;
            } else if (action === "decrement") {
                existingCartItem.quantity--;
                if (existingCartItem.quantity <= 0) {
                    cart = cart.filter((item) => !(item.id === cupId && !item.customized));
                }
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            populateCart();
            showCart();
        }
    });

    // Initialize the app by fetching cups and populating the cups container
    fetchCups().done(function (data) {
        //cups = data.cups;
        populateCups(cups);
    });

    // Fetch aesthetics and text colors and store them in global variables
    fetchAesthetics().done(function (data) {
        aesthetics = data.aesthetics;
    });

    fetchTextColors().done(function (data) {
        text_colors = data.text_colors;
    });

    populateCart();
});

