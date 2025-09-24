import React from "react";
import { useParams } from "react-router-dom";
import ProductList from "../components/ProductList";
import { useSearchProductsQuery } from "../../redux/api/productApi";
import Navbar from "../components/Navbar";

const SearchPage = () => {
  const { keyword } = useParams();

  // RTK Query hook
  const { data, isLoading, error } = useSearchProductsQuery(keyword, {
    skip: !keyword, // skip query if no keyword
  });

  const products = data?.products || data || [];

  return (
    <>
    <Navbar/>
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">
        Search results for: <span className="text-blue-600">{keyword}</span>
      </h2>

      <ProductList
        title={`Results for "${keyword}"`}
        products={products}
        isLoading={isLoading}
        error={error}
      />
    </div>
    </>
  );
};

export default SearchPage;
