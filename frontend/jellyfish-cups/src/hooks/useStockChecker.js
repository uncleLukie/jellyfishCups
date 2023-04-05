import { useState } from 'react';

const useStockChecker = () => {
  const [outOfStockItems, setOutOfStockItems] = useState([]);

  const checkStock = async (items) => {
    const response = await fetch('/check_stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();
    setOutOfStockItems(data.out_of_stock_items);
  };

  return [outOfStockItems, checkStock];
};

export default useStockChecker;
