// src/redux/slices/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  buyNowProduct: null, // for checkout if buy now
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setBuyNowProduct: (state, action) => {
      state.buyNowProduct = action.payload;
    },
    clearBuyNowProduct: (state) => {
      state.buyNowProduct = null;
    },
  },
});

export const { setBuyNowProduct, clearBuyNowProduct } = cartSlice.actions;
export default cartSlice.reducer;
