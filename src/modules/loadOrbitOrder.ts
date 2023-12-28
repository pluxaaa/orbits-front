import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import cartSlice from '../store/cartSlice';
import { getOrbitOrder } from './getOrbitOrder';

const loadOrbitOrder = async (userToken: string | null, dispatch: ThunkDispatch<any, undefined, AnyAction>) => {
  const reqIDString: string | null = localStorage.getItem('reqID');

  const reqID: number = reqIDString ? parseInt(reqIDString, 10) : 0;

  const orbitOrder = await getOrbitOrder(reqID, userToken?.toString());

  dispatch(cartSlice.actions.setOrbits(orbitOrder.map((orbit) => orbit.orbit_name)));

  const newTransfersOrder: { [orbit: string]: number } = {};
  orbitOrder.forEach((orbit, index) => {
    newTransfersOrder[orbit.orbit_name] = index + 1;
  });

  dispatch(cartSlice.actions.setTransfersOrder(newTransfersOrder));
};

export default loadOrbitOrder;
