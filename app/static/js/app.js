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
  // Add cup to the cart object
  cart.items.push(cupId);
  // Optionally, update the cart UI or show a message
}

function handleCheckout() {
  // Handle the checkout process, e.g., send the cart data to the server
  // and redirect the user to the checkout page
}

$(document).ready(function () {
  fetchCups().done(function (data) {
    let cups = data.cups;
    populateCups(cups);
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
});
