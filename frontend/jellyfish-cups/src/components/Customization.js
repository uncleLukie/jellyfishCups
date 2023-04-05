import React, {useContext} from 'react';
import {CustomizationContext} from '../contexts/CustomizationContext.js';
import {CartContext} from '../contexts/CartContext.js';
import {useNavigate} from 'react-router-dom';

const Customization = ({onCancel}) => {
    const {customization, setCustomization} = useContext(CustomizationContext);
    const {addToCart, clearCart} = useContext(CartContext);
    const navigate = useNavigate();

    const handleAddToCart = () => {
        addToCart({...customization.cup, customization});
        setCustomization(null);
        navigate('/cart');
    };

    const handleClearCart = () => {
        clearCart();
        onCancel();
    };

    if (!customization) return null;

    return (
        <div className="customization">
            <h2>Customize your {customization.cup.name}</h2>
            {/* Add customization options here */}
            <div className="actions">
                <button className="button" onClick={handleAddToCart}>
                    Add to Cart
                </button>
                <button className="button button--outline" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Customization;
