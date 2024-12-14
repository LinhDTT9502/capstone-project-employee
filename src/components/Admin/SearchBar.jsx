import React, { useState } from "react";
import { searchProducts } from "../../api/apiProduct";

const SearchBar = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value) {
      try {
        const response = await searchProducts(e.target.value);
        setResults(response.data?.data?.$values || []);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    } else {
      setResults([]);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full border rounded px-3 py-2"
      />
      {results.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded shadow-lg mt-1 max-h-48 overflow-y-auto">
          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                onSelect(product);
                setQuery("");
                setResults([]);
              }}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center"
            >
              <img
                src={product.imgAvatarPath}
                alt={product.productName}
                className="w-8 h-8 rounded object-cover mr-3"
              />
              <span>{product.productName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
