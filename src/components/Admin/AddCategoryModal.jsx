import React, { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { SportSelect } from "../Product/SportSelect";

const AddCategoryModal = ({ isOpen, onClose, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState("");
  const [sportId, setSportId] = useState(0);
  const [uploadFile, setUploadFile] = useState(null); // For file upload
  const [errors, setErrors] = useState({}); // For validation errors


  const removeMainImage = () => {
    setUploadFile(null);
  };

  const handleSubmit = async () => {
    // Validation
    if (!categoryName.trim() || sportId < 0 || !uploadFile) {
      setErrors({
        categoryName: !categoryName.trim() ? "Tên danh mục là bắt buộc." : "",
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
      formData.append("sportId", sportId);
      formData.append("categoryImage", uploadFile); // Append file

      // Call API
      await onAddCategory(formData);

      // Reset fields after successful submission
      setCategoryName("");
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
          <SportSelect isEdit={true} sport={sportId} setSport={setSportId} />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh sản phẩm đại diện</label>
          <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-md">
            {uploadFile ? (
              <div className="relative">
                <img
                  src={uploadFile instanceof File ? URL.createObjectURL(uploadFile) : uploadFile}
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
                      onChange={(e) => setUploadFile(e.target.files[0])}
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
