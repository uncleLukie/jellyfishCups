import React, { useState, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import useStockChecker from '../hooks/useStockChecker';

const Checkout = () => {
  const [email, setEmail] = useState('');
  const { cartItems, clearCart } = useContext(CartContext);
  const [outOfStockItems, checkStock] = useStockChecker();

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Check stock before proceeding
    await checkStock(cartItems);

    if (outOfStockItems.length > 0) {
      // Display out of stock items and ask the user to remove them from the cart
      return;
    }

    // Continue with the checkout process
    // TODO: Implement the rest of the checkout process
  };

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handleCheckout}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Checkout;
