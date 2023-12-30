import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ViewModeState {
  mode: 'table' | 'cards';
}

const initialState: ViewModeState = {
  mode: 'table',
};

const viewModeSlice = createSlice({
  name: 'viewMode',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'table' | 'cards'>) => {
      state.mode = action.payload;
    },
  },
});

export const { setViewMode } = viewModeSlice.actions;
export default viewModeSlice.reducer;
