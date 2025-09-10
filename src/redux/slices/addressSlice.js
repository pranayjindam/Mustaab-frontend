import { createSlice } from "@reduxjs/toolkit";

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
});

export const { setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
