import React, { useContext } from 'react';
import { CustomizationContext } from '../contexts/CustomizationContext';

const CupItem = ({ cup }) => {
  const { openCustomizationModal } = useContext(CustomizationContext);

  const handleCustomize = () => {
    openCustomizationModal(cup);
  };

  return (
    <div className="cup-item">
      <img src={cup.image} alt={cup.name} />
      <h3>{cup.name}</h3>
      <p>{cup.description}</p>
      <p>Price: ${cup.price.toFixed(2)}</p>
      <button onClick={handleCustomize}>Customize</button>
    </div>
  );
};

export default CupItem;
