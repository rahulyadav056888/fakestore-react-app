import { createSlice } from '@reduxjs/toolkit';
import { FakestoreContract } from '../contracts/FakestoreContract';

interface CartState {
    cartItems: FakestoreContract[];
    cartCount: number;
}

const initialState: CartState = {
    cartItems: [],
    cartCount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const cartItem = state.cartItems.find((item) => {
                return item.id == action.payload.id
            })
            if (cartItem != undefined) {
                cartItem.quantity += 1;
            } else {
                state.cartItems.push(action.payload);
            }
            state.cartCount = state.cartItems.length;
        },
        removeFromCart(state, action) {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload.id);
            state.cartCount = state.cartItems.length;
        },
    },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
