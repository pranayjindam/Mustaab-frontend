import React from "react";
import ProductList from "./ProductList";

export default function RecentSearches({ recentProducts }) {
  console.log("from rencentsearcehs",recentProducts);
  if (!recentProducts || recentProducts.length === 0) return null;
  return <ProductList title="Recently Viewed" products={recentProducts} />;
}
