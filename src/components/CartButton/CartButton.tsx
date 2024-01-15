import {FC} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import store from '../../store/store';
import './CartButton.styles.css';
import { Button } from 'react-bootstrap';

const CartButton: FC = () => {
  const orbits = useSelector((state: ReturnType<typeof store.getState>) => state.cart.orbits);
  const navigate = useNavigate()

  return (
    <Button 
      className={"cart-button"} 
      disabled={orbits?.length === 0}
      onClick={() => (navigate(`/transfer_requests/${localStorage.getItem('reqID')}`))}>
      Корзина ({orbits?.length || 0})
    </Button>
  );
};

export default CartButton;
