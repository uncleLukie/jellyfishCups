import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CupList from './components/CupList';
import Customization from './components/Customization';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<CupList />} />
          <Route path="/customization/:id" element={<Customization />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
