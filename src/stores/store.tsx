import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slicers/CartSlicer";

const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>; // Export RootState type

export default store;
