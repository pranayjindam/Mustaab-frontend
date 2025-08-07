// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../redux/productSlice';  // Importing the productSlice
import authReducer from '../redux/authSlice';  // Importing the authSlice
import cartReducer from "../redux/cartSlice"
export const store = configureStore({
  reducer: {
    products: productReducer,
    auth: authReducer,
    cart: cartReducer  // Add authReducer to the store
  },
});
