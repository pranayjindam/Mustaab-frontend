import { createSlice } from "@reduxjs/toolkit";
import { logout } from "./authSlice"; // import logout action

const initialState = {
  selectedAddress: null,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Reset address on logout
    builder.addCase(logout, (state) => {
      state.selectedAddress = null;
    });
  },
});

export const { setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
