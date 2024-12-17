import { useState, useEffect } from "react";
import { fetchCategories } from "../../services/categoryService";

export function CategorySelect() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    loadCategories();
  }, []);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Danh mục
      </label>
      <select
        className="mt-1 p-2 border border-gray-300 rounded w-full"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" disabled>
          Chọn danh mục
        </option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.categoryName}
          </option>
        ))}
      </select>
    </div>
  );
}
