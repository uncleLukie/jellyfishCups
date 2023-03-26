let cups = [];

function createCupCard(cup) {
  return `
    <div class="col">
      <div class="card h-100">
        <img src="${cup.image_url}" class="card-img-top" alt="${cup.name}">
        <div class="card-body">
          <h5 class="card-title">${cup.name}</h5>
          <p class="card-text">$${cup.price.toFixed(2)}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary add-to-cart" data-cup-id="${cup.id}">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

function populateCups(cups) {
  for (let i = 0; i < cups.length; i++) {
    let cup = cups[i];
    let cupCard = createCupCard(cup);
    $("#cups-container").append(cupCard);
  }
}

function fetchCups() {
  return $.get("/api/cups", function (data) {
    return data.cups;
  });
}

// Example cart data structure
let cart = {
  items: [],
  // Add more properties if needed
};

function addToCart(cupId) {
  let cup = getCupById(cupId);

  if (cup.customizable) {
    openCustomizationModal(cup);
  } else {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cup);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

function getCupById(cupId) {
  let cups = JSON.parse(localStorage.getItem("cups")) || [];
  return cups.find(cup => cup.id === cupId);
}

function populateCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  $("#cart-count").text(cart.length);
}

function showCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItems = "";

  cart.forEach((cup) => {
    cartItems += `<li>${cup.name} - ${cup.aesthetic} - ${cup.text_color} - ${cup.text_content}</li>`;
  });

  $("#cart-items").html(cartItems);
  $("#cartModal").modal("show");
}

function handleCheckout() {
  // Handle the checkout process, e.g., send the cart data to the server
  // and redirect the user to the checkout page
}

function openCustomizationModal(cup) {
  // Populate aesthetic options
  let aestheticOptions = "";
  aesthetics.forEach((aesthetic) => {
    aestheticOptions += `<option value="${aesthetic.id}" data-image="${aesthetic.image_url}">${aesthetic.name} (${aesthetic.price.toFixed(2)})</option>`;
  });
  $("#aesthetic-selector").html(aestheticOptions);

  // Populate text color options
  let textColorOptions = "";
  text_colors.forEach((text_color) => {
    textColorOptions += `<option value="${text_color.id}" data-image="${text_color.image_url}">${text_color.color} (${text_color.price.toFixed(2)})</option>`;
  });
  $("#text-color-selector").html(textColorOptions);

  // Open the customization modal
  $("#customizationModal").data("cup", JSON.stringify(cup)).modal("show");
}

$(document).ready(function () {
  fetchCups().done(function (data) {
    let cups = data.cups;
    populateCups(cups);
    localStorage.setItem("cups", JSON.stringify(cups)); // Store fetched cups in localStorage
  });

  // Event listener for "Add to Cart" buttons
  $("#cups-container").on("click", ".add-to-cart", function () {
    let cupId = $(this).data("cup-id");
    addToCart(cupId);
  });


  // Event listener for the "Checkout" button
  $("#checkout-button").click(function () {
    handleCheckout();
  });

  $("#view-cart-button").on("click", function () {
    showCart();
  });

  $("#aesthetic-selector").on("change", function () {
    let selectedAesthetic = $(this).find("option:selected");
    let imageUrl = selectedAesthetic.data("image");
    $("#aesthetic-preview").attr("src", imageUrl).show();
  });

  $("#text-color-selector").on("change", function () {
    let selectedTextColor = $(this).find("option:selected");
    let imageUrl = selectedTextColor.data("image");
    $("#text-color-preview").attr("src", imageUrl).show();
  });

  $("#save-customization").on("click", function () {
  let cup = JSON.parse($("#customizationModal").data("cup"));
  let selectedAesthetic = $("#aesthetic-selector option:selected");
  let selectedTextColor = $("#text-color-selector option:selected");
  let textContent = $("#text-content").val();

  cup.aesthetic_id = selectedAesthetic.val();
  cup.aesthetic_name = selectedAesthetic.text();
  cup.aesthetic_image_url = selectedAesthetic.data("image");
  cup.text_color_id = selectedTextColor.val();
  cup.text_color_name = selectedTextColor.text();
  cup.text_color_image_url = selectedTextColor.data("image");
  cup.text_content = textContent;

  addToCart(cup);
    $("#customizationModal").modal("hide");
  });

});
