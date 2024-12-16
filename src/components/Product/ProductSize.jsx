import { useState, useEffect } from "react";
import { fetchProductSize } from "../../services/productService";

export function ProductSize({ productCode, color, selectedSize, setSelectedSize }) {
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    const loadSizes = async () => {
      try {
        const data = await fetchProductSize(productCode, color);
        setSizes(data);

        if (!selectedSize && data.length > 0) {
          const availableSize = data.find(size => size.status);
          if (availableSize) {
            setSelectedSize(availableSize.size);
          }
        }
      } catch (error) {
        console.error("Failed to load product sizes:", error);
      }
    };

    if (productCode && color) {
      loadSizes();
    }
  }, [productCode, color, selectedSize, setSelectedSize]);

  return (
    <div className="space-y-2">
      <select
        id="product-size-select"
        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={selectedSize || ""}
        onChange={(e) => setSelectedSize(e.target.value)}
      >
        <option value="" disabled>
          Chọn kích cỡ
        </option>
        {sizes.map((size) => (
          <option key={size.size} value={size.size} disabled={!size.status}>
            {size.size} {size.status ? "" : "(Hết hàng)"}
          </option>
        ))}
      </select>
    </div>
  );
}