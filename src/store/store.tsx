import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from './authSlice'
import cartSlice from './cartSlice'
import newFilterReducers from './newFilter';
import viewModeReducer from "./viewModeSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartSlice.reducer,
        newFilter: newFilterReducers,
        viewMode: viewModeReducer,
    }
})

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
