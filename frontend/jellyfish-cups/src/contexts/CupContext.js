import React, { createContext, useState, useEffect } from 'react';

const CupContext = createContext();

const CupProvider = ({ children }) => {
  const [cups, setCups] = useState([]);

  useEffect(() => {
    // Fetch cups data from your API or use a static data source
    const fetchData = async () => {
      const response = await fetch('your_api_url_here');
      const data = await response.json();
      setCups(data);
    };

    fetchData();
  }, []);

  return (
    <CupContext.Provider value={{ cups }}>
      {children}
    </CupContext.Provider>
  );
};

export { CupContext, CupProvider };
