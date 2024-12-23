import React, { useState, useEffect } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { SportSelect } from "../Product/SportSelect";

const EditCategoryModal = ({ isOpen, onClose, onEditCategory, category }) => {
  const [categoryName, setCategoryName] = useState("");
  const [sportId, setSportId] = useState(0);
  const [categoryImage, setCategoryImage] = useState(null);

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName || "");
      setSportId(category.sportId || 0);
      setCategoryImage(category.categoryImgPath || null); // Use a valid URL if it's already set
    }
  }, [category]);

  const handleSubmit = async () => {
    if (!categoryName.trim() || !sportId || !categoryImage) {
      alert("Tất cả các trường đều bắt buộc.");
      return;
    }

    const formData = new FormData();
    formData.append("categoryName", categoryName.trim());
    formData.append("sportId", sportId);
    if (categoryImage instanceof File) {
      formData.append("categoryImage", categoryImage); // Only append file if it's a new upload
    }

    try {
      await onEditCategory(category.id, formData);
      onClose();
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Có lỗi xảy ra khi lưu danh mục.");
    }
  };

  const removeMainImage = () => {
    setCategoryImage(null);
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
          <SportSelect isEdit={true} sport={sportId} setSport={setSportId} />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh sản phẩm đại diện</label>
          <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-md">
            {categoryImage ? (
              <div className="relative">
                <img
                  src={categoryImage instanceof File ? URL.createObjectURL(categoryImage) : categoryImage}
                  alt="Main product"
                  className="max-h-32 rounded-md"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute top-1 right-1 -mt-2 -mr-2 text-black p-1 hover:text-red-500"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <FontAwesomeIcon icon={faSave} className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="main-image-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Tải ảnh lên</span>
                    <input
                      id="main-image-upload"
                      name="main-image-upload"
                      type="file"
                      className="sr-only"
                      onChange={(e) => setCategoryImage(e.target.files[0])}
                    />
                  </label>
                  <p className="pl-1">hoặc kéo và thả</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
              </div>
            )}
          </div>
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
