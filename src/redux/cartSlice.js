// src/redux/cartSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add to cart actions
    addToCartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    addToCartSuccess: (state, action) => {
      state.loading = false;
      const existingItem = state.cart.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1; // Increment quantity if item exists
      } else {
        state.cart.push({ ...action.payload, quantity: 1 }); // Add new item with quantity 1
      }
    },
    addToCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Remove from cart actions
    removeFromCartRequest: (state) => {
      state.loading = true;
    },
    removeFromCartSuccess: (state, action) => {
      state.loading = false;
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    removeFromCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update cart quantity
    updateCartQuantityRequest: (state) => {
      state.loading = true;
      
    },
    updateCartQuantitySuccess: (state, action) => {
      state.loading = false;
      const { id, quantity } = action.payload;
      const item = state.cart.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    updateCartQuantityFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear cart
    clearCartRequest: (state) => {
      state.loading = true;
    },
    clearCartSuccess: (state) => {
      state.loading = false;
      state.cart = [];
    },
    clearCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFailure,
  updateCartQuantityRequest,
  updateCartQuantitySuccess,
  updateCartQuantityFailure,
  clearCartRequest,
  clearCartSuccess,
  clearCartFailure,
} = cartSlice.actions;

export default cartSlice.reducer;
