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

function calculateCartTotal() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  cart.forEach((cup) => {
    let cupPrice = cup.price * cup.quantity;
    let aestheticPrice = cup.aesthetic ? cup.aesthetic.price * cup.quantity : 0;
    let textColorPrice = cup.text_color ? cup.text_color.price * cup.quantity : 0;
    total += cupPrice + aestheticPrice + textColorPrice;
  });

  return total;
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

  if (!cup) {
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cup.customizable) {
    cup.quantity = 1; // Add this line to set the quantity property for the customizable cup
    cart.push(cup);
  } else {
    const existingCup = cart.find(item => item.id === cup.id && !item.customizable);
    if (existingCup) {
      existingCup.quantity += 1;
    } else {
      cup.quantity = 1;
      cart.push(cup);
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  populateCart();
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
    const quantityControl = cup.customizable
      ? ''
      : `
        <button class="btn btn-sm btn-outline-secondary update-quantity" data-cup-id="${cup.id}" data-action="decrement">-</button>
        <input type="text" class="form-control cart-item-quantity" value="${cup.quantity}" readonly />
        <button class="btn btn-sm btn-outline-secondary update-quantity" data-cup-id="${cup.id}" data-action="increment">+</button>
      `;
    cartItems += `
      <li class="d-flex justify-content-between align-items-center">
        <span>${cup.name}${customizations ? ' - ' + customizations : ''}</span>
        <span class="d-flex align-items-center">
          ${quantityControl}
          <span class="ms-2">$${(cup.customizable && cup.total_price ? cup.total_price : cup.price * cup.quantity).toFixed(2)}</span>
        </span>
      </li>
    `;
  });

  // Call calculateCartTotal and update the total price in the cart modal
  let totalPrice = calculateCartTotal();
  $("#cart-total").text(totalPrice.toFixed(2));
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
    aestheticOptions += `<option value="${aesthetic.id}" data-image="${aesthetic.image_url}" data-price="${aesthetic.price}">${aesthetic.name} (${aesthetic.price.toFixed(2)})</option>`;
  });
  $("#aesthetic-selector").html(aestheticOptions);

  // Populate text color options
  let textColorOptions = "";
  text_colors.forEach((text_color) => {
    textColorOptions += `<option value="${text_color.id}" data-image="${text_color.image_url}" data-price="${text_color.price}">${text_color.color} (${text_color.price.toFixed(2)})</option>`;
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

  function calculateTotalPrice(cup, aestheticPrice, textColorPrice) {
    return cup.price + aestheticPrice + textColorPrice;
  }


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
    let cup = getCupById(cupId);

    if (cup.customizable) {
      selectedCup = cup;
      openCustomizationModal();
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

    $("#cart-items").on("click", ".plus", function () {
      let index = $(this).closest("li").index();
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart[index].quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      showCart();
    });

    $("#cart-items").on("click", ".minus", function () {
      let index = $(this).closest("li").index();
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart[index].quantity--;

      if (cart[index].quantity === 0) {
        cart.splice(index, 1);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      showCart();
    });
    $("#cart-items").on("click", ".update-quantity", function () {
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

    populateCart();
});
