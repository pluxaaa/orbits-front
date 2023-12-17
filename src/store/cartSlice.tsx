import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  orbits: string[] | undefined;
  added: boolean;
}

const initialState: CartState = {
  orbits: localStorage.getItem('orbits')
    ? localStorage.getItem('orbits')?.split(',')
    : [],
  added: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addOrbit(state, { payload }: PayloadAction<string>) {
      console.log("addOrbit slice");
      if (!state.orbits) {
        state.orbits = [];
      }

      if (state.orbits.indexOf(payload) === -1) {
        state.orbits.push(payload);
        localStorage.setItem('orbits', state.orbits.toString());
      }
      state.added = true;
    },
    removeOrbit(state, { payload }: PayloadAction<string>) {
      if (!state.orbits) {
        state.orbits = [];
      }

      if (state.orbits.length === 0) {
        return;
      }

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
      if (!state.orbits) {
        state.orbits = [];
      }

      payload.forEach((orbit) => {
        if (state.orbits && state.orbits.indexOf(orbit) === -1) {
          state.orbits.push(orbit);
        }
      });

      localStorage.setItem('orbits', state.orbits.toString());
    },
  },
});

export default cartSlice;
