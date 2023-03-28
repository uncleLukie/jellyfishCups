let cups = [];
let aesthetics = [];
let text_colors = [];
let selectedCup = null;

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

function fetchAesthetics() {
  return $.get("/api/aesthetics", function (data) {
    return data.aesthetics;
  });
}

function fetchTextColors() {
  return $.get("/api/text_colors", function (data) {
    return data.text_colors;
  });
}


function fetchCups() {
  return $.get("/api/cups", function (data) {
    localStorage.setItem("cups", JSON.stringify(data.cups));
    populateCups(data.cups);
  });
}

// Example cart data structure
let cart = {
  items: [],
  // Add more properties if needed
};

function addToCart(cupId, customizedCup = null) {
  let cup = customizedCup ? customizedCup : getCupById(cupId);
  console.log("Cup:", cup);

  if (!cup) {
    return;
  }

  if (cup.customizable && !customizedCup) {
    selectedCup = cup;
    openCustomizationModal();
  } else {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(cup);
    localStorage.setItem("cart", JSON.stringify(cart));
    populateCart();
  }
}

function getCupById(cupId) {
  let cups = JSON.parse(localStorage.getItem("cups")) || [];
  let cup = cups.find(cup => cup.id === cupId);
  return cup ? {...cup, name: cup.name || ''} : null;
}

function populateCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  $("#cart-count").text(cart.length);
}

function showCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItems = "";

  cart.forEach((cup) => {
    const aestheticText = cup.aesthetic ? cup.aesthetic.name : '';
    const textColorText = cup.text_color ? cup.text_color.name : '';
    const textContentText = cup.text_content || '';
    const customizations = [aestheticText, textColorText, textContentText].filter(Boolean).join(" - ");
    cartItems += `<li>${cup.name}${customizations ? ' - ' + customizations : ''}</li>`;
  });

  $("#cart-items").html(cartItems);
  $("#cartModal").modal("show");
}

function handleCheckout() {
  // Handle the checkout process, e.g., send the cart data to the server
  // and redirect the user to the checkout page
}

function openCustomizationModal() {
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

  $("#customizationModal").modal("show");
}

$(document).ready(function () {
  fetchCups().done(function (data) {
    let cups = data.cups;
  });

 // Fetch aesthetics and text colors and store them in global variables
  fetchAesthetics().done(function (data) {
    aesthetics = data.aesthetics;
  });

  function clearCart() {
  localStorage.removeItem("cart");
  populateCart();
   $("#cartModal").modal("hide");
  }


  fetchTextColors().done(function (data) {
    text_colors = data.text_colors;
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
    let cup = selectedCup;
    let selectedAesthetic = $("#aesthetic-selector option:selected");
    let selectedTextColor = $("#text-color-selector option:selected");
    let textContent = $("#text-content").val();

    cup.aesthetic_id = parseInt(selectedAesthetic.val());
    cup.aesthetic = {
      name: selectedAesthetic.text(),
      image_url: selectedAesthetic.data("image")
    };
    cup.text_color_id = parseInt(selectedTextColor.val());
    cup.text_color = {
      name: selectedTextColor.text(),
      image_url: selectedTextColor.data("image")
    };
    cup.text_content = textContent;

    addToCart(cup.id, cup);
    $("#customizationModal").modal("hide")
    });

    $("#clear-cart-button").on("click", function () {
    clearCart();
    });
    populateCart();
});
