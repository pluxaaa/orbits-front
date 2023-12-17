import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  orbits: string[];
  added: boolean;
}

const initialState: CartState = {
  orbits: localStorage.getItem('orbits')
    ? localStorage.getItem('orbits')?.split(',') || []
    : [],
  added: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addOrbit(state, { payload }: PayloadAction<string>) {
      if (!state.orbits.includes(payload)) {
        state.orbits.push(payload);
        localStorage.setItem('orbits', state.orbits.toString());
      }
      state.added = true;
    },
    removeOrbit(state, { payload }: PayloadAction<string>) {
      const orbitIndex = state.orbits.indexOf(payload);
      if (orbitIndex > -1) {
        state.orbits.splice(orbitIndex, 1);
        localStorage.setItem('orbits', state.orbits.toString());
      }
    },
    disableAdded(state) {
      state.added = false;
    },
    setOrbits(state, { payload }: PayloadAction<string[]>) {
      state.orbits = Array.from(new Set([...state.orbits, ...payload]));
      localStorage.setItem('orbits', state.orbits.toString());
    },
  },
});

export default cartSlice;
