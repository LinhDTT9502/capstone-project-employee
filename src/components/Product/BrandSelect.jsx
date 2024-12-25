import { useState, useEffect } from "react";
import { getAllBrands } from "../../services/brandService";

export function BrandSelect({ isEdit, brand, setBrand }) {
  const [brands, setBrands] = useState([]);

  const loadBrands = async () => {
    try {
      const fetchedBrands = await getAllBrands();
      setBrands(fetchedBrands);
      // Set the first sport as the default selected option
      if (fetchedBrands.length > 0 && !brand) {
        setBrand(brand);
      }
    } catch (error) {
      console.error("Failed to fetch brand:", error);
    }
  };

  useEffect(() => {

    loadBrands();
  }, []);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Thương hiệu
      </label>
      <select
        className="mt-1 p-2 border border-gray-300 rounded w-full"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        disabled={!isEdit} // Disable if isEdit is false
      >
        <option value="" disabled>
          Chọn thương hiệu
        </option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.brandName}
          </option>
        ))}
      </select>
    </div>
  );
}
