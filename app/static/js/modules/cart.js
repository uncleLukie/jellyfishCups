import {getCupById} from './cup.js';

export {addToCart, populateCart, showCart, clearCart};

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