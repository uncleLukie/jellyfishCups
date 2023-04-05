import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext.js';

const Navbar = () => {
  const { cart } = useContext(CartContext);

  return (
    <nav>
      <div className="container">
        <Link to="/">Jellyfish Cups</Link>
        <Link to="/cart">Cart ({cart.length})</Link>
      </div>
    </nav>
  );
};

export default Navbar;
