import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  orbits: string[];
  visitNumbers: { [orbit: string]: number };
  added: boolean;
}

const initialState: CartState = {
  orbits: localStorage.getItem('orbits')
    ? localStorage.getItem('orbits')?.split(',') || []
    : [],
  visitNumbers: localStorage.getItem('visitNumbers')
    ? JSON.parse(localStorage.getItem('visitNumbers') || '{}')
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

        state.visitNumbers[payload] = state.orbits.length;

        localStorage.setItem('orbits', state.orbits.toString());
        localStorage.setItem('visitNumbers', JSON.stringify(state.visitNumbers));
      }
      state.added = true;
    },
    removeOrbit(state, { payload }: PayloadAction<string>) {
      const orbitIndex = state.orbits.indexOf(payload);
      if (orbitIndex > -1) {
        const removedOrbit = state.orbits.splice(orbitIndex, 1)[0];
        delete state.visitNumbers[removedOrbit];

        state.orbits.forEach((orbit, index) => {
          state.visitNumbers[orbit] = index + 1;
        });

        localStorage.setItem('orbits', state.orbits.toString());
        localStorage.setItem('visitNumbers', JSON.stringify(state.visitNumbers));
      }
    },
    disableAdded(state) {
      state.added = false;
    },
    setOrbits(state, { payload }: PayloadAction<string[]>) {
      state.orbits = Array.from(new Set([...state.orbits, ...payload]));
      
      localStorage.setItem('orbits', state.orbits.toString());
    },
    setVisitNumbers(state, { payload }: PayloadAction<{ [orbit: string]: number }>) {
      state.visitNumbers = payload;
      localStorage.setItem('visitNumbers', JSON.stringify(state.visitNumbers));
    },
  },
});

export default cartSlice;
