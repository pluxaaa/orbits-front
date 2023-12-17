import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import store from '../../store/store';
import './CartButton.styles.css';

const CartButton: React.FC = () => {
  const orbits = useSelector((state: ReturnType<typeof store.getState>) => state.cart.orbits);

  return (
    <NavLink to="/cart" className="cart-button">
      Корзина ({orbits?.length || 0})
    </NavLink>
  );
};

export default CartButton;
