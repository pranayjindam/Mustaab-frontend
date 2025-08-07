// src/redux/cartActions.js

import { use } from "react";
import { addToCartRequest,
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
  clearCartFailure, } from "../../redux/cartSlice.js";
import axios from "axios"; // For showing notifications
import { useDispatch } from "react-redux";

export const addToCart = (productId,name,discount,price,color,size,image) => async (dispatch, getState) => {
  dispatch(addToCartRequest());
  const { auth } = getState(); // Get the user from the Redux store (auth)
  const token = localStorage.getItem("token"); // Get token from localStorage

if (!token) {
  alert("You must be logged in to add to cart");
  return;
}


try {
 
  const response = await axios.post(
    "http://localhost:2000/api/cart/add",
    { productId,
       name,
       discount,
       price,
       color,
       size,
       image
     },
    {
      headers: {
        Authorization: `Bearer ${token}`, // Ensure Bearer is included
        "Content-Type": "application/json",
      },
    }
  );
console.log(response);
    if (response.data.success) {
      dispatch(addToCartSuccess(response.data.cart)); // Assuming the cart data is returned
      toast.success("Item added to cart!", { position: "top-right" });
    } else {
      dispatch(addToCartFailure("Failed to add to cart"));
      toast.error("Failed to add to cart", { position: "top-right" });
    }
  } catch (error) {
    dispatch(addToCartFailure(error.message));
    toast.error("Error occurred while adding to cart", { position: "top-right" });
  }
};

import { toast } from "react-toastify";


export const updateCart = (productId, qty) => async (dispatch, getState) => {
  
  dispatch(updateCartQuantityRequest()); // Start loading state
  const { auth } = getState(); // Get the user from the Redux store (auth)
  const token = localStorage.getItem("token"); // Get token from localStorage
  if (!token) {
    toast.error("You must be logged in to update the cart", { position: "bottom-left" });
    return;
  }
  try {
    const response = await axios.put(
      "http://localhost:2000/api/cart/update",
      { productId, qty ,maxQuantity}, // Send product ID and quantity
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.success) {
      dispatch(updateCartQuantitySuccess(response.data.cart)); // Update Redux store
      toast.success("Cart updated!", { position: "bottom-left" });
    } else {
      dispatch(updateCartQuantityFailure("Failed to update cart"));
      toast.error("Failed to update cart", { position: "bottom-left" });
    }
  } catch (error) {
    dispatch(updateCartQuantityFailure(error.message)); // Handle error
    toast.error("Error updating cart", { position: "bottom-left" });
  }
};
 
