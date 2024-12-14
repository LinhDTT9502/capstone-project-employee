import React, { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState("");
  const [sportName, setSportName] = useState("");
  const [sportId, setSportId] = useState(0);
  const [uploadFile, setUploadFile] = useState(null); // For file upload
  const [errors, setErrors] = useState({}); // For validation errors

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!categoryName.trim() || !sportName.trim() || sportId < 0 || !uploadFile) {
      setErrors({
        categoryName: !categoryName.trim() ? "Tên danh mục là bắt buộc." : "",
        sportName: !sportName.trim() ? "Tên môn thể thao là bắt buộc." : "",
        sportId: sportId < 0 ? "ID môn thể thao không được âm." : "",
        categoryImage: !uploadFile ? "Hình ảnh là bắt buộc." : "",
      });
      return;
    }

    // Reset errors
    setErrors({});

    try {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append("categoryName", categoryName.trim());
      formData.append("sportName", sportName.trim());
      formData.append("sportId", sportId);
      formData.append("categoryImage", uploadFile); // Append file

      // Call API
      await onAddCategory(formData);

      // Reset fields after successful submission
      setCategoryName("");
      setSportName("");
      setSportId(0);
      setUploadFile(null);
      onClose();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors); // Display validation errors from API
      } else {
        console.error("Lỗi không xác định:", error);
      }
    }
  };

  return (
    <Dialog open={isOpen} handler={onClose}>
      <div className="p-6 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Thêm Danh Mục</h3>
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
          {errors.categoryName && <p className="text-sm text-red-500">{errors.categoryName}</p>}
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
          {errors.sportName && <p className="text-sm text-red-500">{errors.sportName}</p>}
        </div>
        <div className="mt-4">
          <label htmlFor="sportId" className="block text-sm font-medium text-gray-700">
            ID Môn Thể Thao (không âm)
          </label>
          <input
            type="number"
            id="sportId"
            value={sportId}
            onChange={(e) => setSportId(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
            min="0"
          />
          {errors.sportId && <p className="text-sm text-red-500">{errors.sportId}</p>}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Hình Ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.categoryImage && (
            <p className="text-sm text-red-500">{errors.categoryImage}</p>
          )}
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
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Thêm
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddCategoryModal;
