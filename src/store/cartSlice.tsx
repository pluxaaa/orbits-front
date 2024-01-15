import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  orbits: string[];
  transfersOrder: { [orbit: string]: number };
  added: boolean;
  isInCart: boolean;
}

const initialState: CartState = {
  orbits: [],
  transfersOrder: {},
  added: false,
  isInCart: true,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addOrbit(state, { payload }: PayloadAction<string>) {
      if (!state.orbits.includes(payload)) {
        state.orbits.push(payload);
        state.transfersOrder[payload] = state.orbits.length;
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
      }
    },
    disableAdded(state) {
      state.added = false;
    },
    setOrbits(state, { payload }: PayloadAction<string[]>) {
      state.orbits = Array.from(new Set([...state.orbits, ...payload]));
    },
    setTransfersOrder(state, { payload }: PayloadAction<{ [orbit: string]: number }>) {
      state.transfersOrder = payload;
    },
    setIsInCart(state, { payload }: PayloadAction<boolean>) {
      state.isInCart = payload;
    }
  },
});

export default cartSlice;
