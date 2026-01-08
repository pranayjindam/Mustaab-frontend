// ProductFormWrapper.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../../redux/api/productApi";
import ProductForm from "./ProductForm";

export default function ProductFormWrapper() {
  const { productId } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });

  if (isLoading) return <div className="p-6">Loading product…</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load product</div>;

  return (
    <ProductForm
      editingProduct={data?.product || null}
      onClose={() => window.history.back()}
    />
  );
}
