import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../redux/api/productApi";
import ProductForm from "./ProductForm";

export default function ProductFormWrapper() {
  const { productId } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(productId);

  if (isLoading) return <p>Loading product...</p>;
  if (error) return <p>Error loading product</p>;

  return <ProductForm product={data?.product} onClose={() => window.history.back()} />;
}
