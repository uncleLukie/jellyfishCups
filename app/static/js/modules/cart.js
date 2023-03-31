import {getCupById} from './cup.js';
import {handleCheckout} from "./checkout.js";

export {addToCart, populateCart, showCart, clearCart, bindCartEventHandlers, bindClearCartEventHandlers};

function addToCart(cupId, customizedCup = null) {
    let cup = customizedCup ? customizedCup : getCupById(cupId);

    if (!cup || cup.stock <= 0) {
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

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
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

function clearCart() {
    localStorage.removeItem("cart");
    populateCart();
    $("#cartModal").modal("hide");
}

function bindCartEventHandlers() {
    let $cartItems = $("#cart-items");

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

        .on("click", ".update-quantity", function () {
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

}

function bindClearCartEventHandlers() {
    $("#clear-cart-button").on("click", function () {
        clearCart();
    });
}

function removeOutOfStockItems(outOfStockItems) {
    for (const item of outOfStockItems) {
        const itemIndex = cart.findIndex(cartItem => cartItem.cup_id === item.cup_id);
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
        }
    }
    saveCartToLocal();
    displayCartItems();
}

async function checkOut() {
    let items = [];

    // Retrieve the items from the cart
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach((item) => {
        const cartItem = {cup_id: item.id, quantity: item.quantity, customizable: item.customizable};

        if (item.customizable) {
            const aestheticId = item.aesthetic.id;
            const textColorId = item.text_color.id;
            cartItem["aesthetic_id"] = aestheticId;
            cartItem["text_color_id"] = textColorId;
        }

        items.push(cartItem);
    });

    // Check if the items are in stock
    try {
        const response = await fetch("/check_stock", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({items}),
        });

        if (response.ok) {
            const stockResult = await response.json();
            if (stockResult.result === "in_stock") {
                // Redirect to the checkout page
                window.location.href = "/checkout";
            } else {
                // Show an error message for out of stock items
                console.error("Some items are out of stock:", stockResult.out_of_stock_items);
            }
        } else {
            // Show a general error message
            console.error("An error occurred during the checkout process.");
        }
    } catch (error) {
        // Show an error message for network errors or unexpected issues
        console.error("An error occurred during the checkout process:", error);
    }
}


document.getElementById("checkout-button").addEventListener("click", function () {
    checkOut();
});


function showModalToRemoveOutOfStockItems(outOfStockItems) {
    // Create the modal structure
    const modal = document.createElement("div");
    modal.classList.add("modal", "fade");
    modal.setAttribute("tabindex", "-1");
    modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Out of Stock Items</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p>The following items are out of stock:</p>
          <ul id="out-of-stock-list" class="list-group"></ul>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" id="remove-out-of-stock-items">Remove Out of Stock Items</button>
        </div>
      </div>
    </div>
  `;

    document.body.appendChild(modal);

    // Add the out-of-stock items to the list
    const outOfStockList = modal.querySelector("#out-of-stock-list");
    outOfStockItems.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.textContent = `${item.cup_name} - Quantity: ${item.quantity}`;
        outOfStockList.appendChild(listItem);
    });

    // Initialize the Bootstrap modal
    const bsModal = new bootstrap.Modal(modal);

    // Handle the removal of out-of-stock items when the user clicks the "Remove Out of Stock Items" button
    modal.querySelector("#remove-out-of-stock-items").addEventListener("click", () => {
        outOfStockItems.forEach((item) => {
            removeFromCart(item.cup_id);
        });
        updateCartDisplay();
        bsModal.hide();
    });

    // Remove the modal from the DOM when it's hidden
    modal.addEventListener("hidden.bs.modal", () => {
        modal.remove();
    });

    // Show the modal
    bsModal.show();
}
