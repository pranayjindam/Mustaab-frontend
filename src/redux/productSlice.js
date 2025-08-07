import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";




const productSlice = createSlice({
  name: "products",
  initialState: {
    productsByCategory: {}, // Store products separately by category
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.productsByCategory[action.payload.category] = action.payload.products;
        state.loading = false;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    try {
      const response = await axios.get("http://localhost:2000/api/product/all");
      return response.data.products;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category) => {
    try {
      const response = await axios.get(`http://localhost:2000/api/product/${category}`);
      return { category, products: response.data.products };
    } catch (error) {
      throw new Error(error.message);
    }
  }
);





export default productSlice.reducer;
