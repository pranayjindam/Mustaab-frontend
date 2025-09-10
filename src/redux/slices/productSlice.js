// redux/slices/productSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCategory: "all",
  searchKeyword: "",
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
  },
});

export const { setCategory, setSearchKeyword } = productSlice.actions;
export default productSlice.reducer;
