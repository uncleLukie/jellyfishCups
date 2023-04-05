import React, {useContext} from 'react';
import {CupContext} from '../contexts/CupContext.js';
import {CartContext} from '../contexts/CartContext.js';
import {CustomizationContext} from '../contexts/CustomizationContext.js';
import CupItem from './CupItem.js';
import Customization from './Customization.js';

const CupList = () => {
    const {cups} = useContext(CupContext);
    const {addToCart} = useContext(CartContext);
    const {customization, setCustomization} = useContext(CustomizationContext);

    const handleAddToCart = (cup) => {
        addToCart({...cup, customization});
        setCustomization(null);
    };

    return (
        <div className="cup-list">
            {cups.map((cup) => (
                <CupItem
                    key={cup.id}
                    cup={cup}
                    onAddToCart={() => handleAddToCart(cup)}
                />
            ))}
            {customization && (
                <Customization onCancel={() => setCustomization(null)}/>
            )}
        </div>
    );
};

export default CupList;
