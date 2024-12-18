import React, { useState, useEffect } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const EditCategoryModal = ({ isOpen, onClose, onEditCategory, category }) => {
  const [categoryName, setCategoryName] = useState("");
  const [sportName, setSportName] = useState("");
  const [sportId, setSportId] = useState(0);
  const [categoryImage, setCategoryImage] = useState("");

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName || "");
      setSportName(category.sportName || "");
      setSportId(category.sportId || 0);
      setCategoryImage(category.categoryImage || "");
    }
  }, [category]);

  const handleSubmit = () => {
    if (!categoryName.trim() || !sportName.trim() || !sportId || !categoryImage.trim()) {
      alert("Tất cả các trường đều bắt buộc.");
      return;
    }

    const payload = {
      categoryName: categoryName.trim(),
      sportName: sportName.trim(),
      sportId: parseInt(sportId, 10),
      categoryImage: categoryImage.trim(),
    };

    onEditCategory(category.id, payload);

    onClose();
  };

  return (
    <Dialog open={isOpen} handler={onClose}>
      <div className="p-6 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Chỉnh Sửa Danh Mục</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
            Tên Danh Mục
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="sportName" className="block text-sm font-medium text-gray-700">
            Tên Môn Thể Thao
          </label>
          <input
            type="text"
            id="sportName"
            value={sportName}
            onChange={(e) => setSportName(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="sportId" className="block text-sm font-medium text-gray-700">
            ID Môn Thể Thao
          </label>
          <input
            type="number"
            id="sportId"
            value={sportId}
            onChange={(e) => setSportId(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700">
            Đường Dẫn Hình Ảnh
          </label>
          <input
            type="text"
            id="categoryImage"
            value={categoryImage}
            onChange={(e) => setCategoryImage(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
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
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
          >
            <FontAwesomeIcon icon={faSave} className="mr-1" />
            Lưu
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default EditCategoryModal;
