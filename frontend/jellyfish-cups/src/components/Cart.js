import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, getTotal } = useContext(CartContext);

  return (
    <div>
      <h1>Cart</h1>
      {cartItems.length === 0 && <p>Your cart is empty.</p>}
      {cartItems.map((item) => (
        <div key={item.id}>
          <img src={item.image_url} alt={item.name} width="100" />
          <h3>{item.name}</h3>
          <p>Price: ${item.price.toFixed(2)}</p>
          <button onClick={() => removeFromCart(item.id)}>Remove from cart</button>
        </div>
      ))}
      {cartItems.length > 0 && (
        <>
          <p>Total: ${getTotal().toFixed(2)}</p>
          <button onClick={clearCart}>Clear cart</button>
          <Link to="/checkout">
            <button>Proceed to checkout</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default Cart;
