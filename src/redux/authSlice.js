// src/redux/authSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,  // Get user from localStorage (if any)
  token: localStorage.getItem('token') || null,  // Get token from localStorage (if any)
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(action.payload.user));  // Save user to localStorage
      localStorage.setItem('token', action.payload.token);  // Save token to localStorage
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');  // Remove user from localStorage
      localStorage.removeItem('token');  // Remove token from localStorage
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;  // Export actions

export default authSlice.reducer;  // Export reducer to be used in store
