import {
    fetchCups, getCupById, openCustomizationModal,
    populateCups, fetchTextColors, fetchAesthetics, cups, saveCustomization
} from './modules/cup.js';
import {addToCart, populateCart, showCart, clearCart, bindCartEventHandlers,
    bindClearCartEventHandlers } from './modules/cart.js';
import {handleCheckout} from './modules/checkout.js';


let aesthetics = [];
let text_colors = [];
let selectedCup = null;

$(document).ready(function () {
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


    $("#save-customization").on("click", function () {
        let cup = selectedCup;
        let selectedAesthetic = $("#aesthetic-selector option:selected");
        let selectedTextColor = $("#text-color-selector option:selected");
        let textContent = $("#text-content").val();

        let customizedCup = saveCustomization(cup, selectedAesthetic, selectedTextColor, textContent);

        addToCart(customizedCup.id, customizedCup);
        $("#customizationModal").modal("hide");
    });

    bindCartEventHandlers();
    bindClearCartEventHandlers();

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

