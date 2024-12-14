import React, { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import SearchBar from "./SearchBar";

const SearchModal = ({ isOpen, onClose, onAddPromotion }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discount, setDiscount] = useState("");

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleSubmit = () => {
    if (!selectedProduct || !discount) {
      alert("Vui lòng chọn sản phẩm và nhập phần trăm khuyến mãi.");
      return;
    }
    onAddPromotion(selectedProduct.productName, discount);
    setSelectedProduct(null);
    setDiscount("");
    onClose();
  };

  return (
    <Dialog open={isOpen} handler={onClose}>
      <div className="p-6 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Thêm Khuyến Mãi</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            ✖
          </button>
        </div>

        <div className="mt-4">
          <SearchBar onSelect={handleSelectProduct} />
        </div>

        {selectedProduct && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h4 className="text-sm font-semibold">Sản phẩm đã chọn:</h4>
            <div className="flex items-center space-x-4 mt-2">
              <img
                src={selectedProduct.imgAvatarPath}
                alt={selectedProduct.productName}
                className="w-12 h-12 object-cover rounded"
              />
              <span>{selectedProduct.productName}</span>
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Phần trăm khuyến mãi (%)
          </label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
            placeholder="Nhập phần trăm khuyến mãi"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Thêm Khuyến Mãi
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default SearchModal;
