import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  orbits: string[];
  transfersOrder: { [orbit: string]: number };
  added: boolean;
}

const initialState: CartState = {
  orbits: localStorage.getItem('orbits')
    ? localStorage.getItem('orbits')?.split(',') || []
    : [],
  transfersOrder: localStorage.getItem('transfersOrder')
    ? JSON.parse(localStorage.getItem('transfersOrder') || '{}')
    : {},
  added: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addOrbit(state, { payload }: PayloadAction<string>) {
      if (!state.orbits.includes(payload)) {
        state.orbits.push(payload);

        state.transfersOrder[payload] = state.orbits.length;

        localStorage.setItem('orbits', state.orbits.toString());
        localStorage.setItem('transfersOrder', JSON.stringify(state.transfersOrder));
      }
      state.added = true;
    },
    removeOrbit(state, { payload }: PayloadAction<string>) {
      const orbitIndex = state.orbits.indexOf(payload);
      if (orbitIndex > -1) {
        const removedOrbit = state.orbits.splice(orbitIndex, 1)[0];
        delete state.transfersOrder[removedOrbit];

        state.orbits.forEach((orbit, index) => {
          state.transfersOrder[orbit] = index + 1;
        });

        localStorage.setItem('orbits', state.orbits.toString());
        localStorage.setItem('transfersOrder', JSON.stringify(state.transfersOrder));
      }
    },
    disableAdded(state) {
      state.added = false;
    },
    setOrbits(state, { payload }: PayloadAction<string[]>) {
      state.orbits = Array.from(new Set([...state.orbits, ...payload]));
      
      localStorage.setItem('orbits', state.orbits.toString());
    },
    setTransfersOrder(state, { payload }: PayloadAction<{ [orbit: string]: number }>) {
      state.transfersOrder = payload;
      localStorage.setItem('transfersOrder', JSON.stringify(state.transfersOrder));
    },
  },
});

export default cartSlice;
