import React, { createContext, useState } from 'react';

const CustomizationContext = createContext();

const CustomizationProvider = ({ children }) => {
  const [currentCustomization, setCurrentCustomization] = useState(null);
  const [customizationModalOpen, setCustomizationModalOpen] = useState(false);

  const openCustomizationModal = (cup) => {
    setCurrentCustomization(cup);
    setCustomizationModalOpen(true);
  };

  const closeCustomizationModal = () => {
    setCurrentCustomization(null);
    setCustomizationModalOpen(false);
  };

  return (
    <CustomizationContext.Provider
      value={{
        currentCustomization,
        customizationModalOpen,
        openCustomizationModal,
        closeCustomizationModal,
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
};

export { CustomizationContext, CustomizationProvider };
