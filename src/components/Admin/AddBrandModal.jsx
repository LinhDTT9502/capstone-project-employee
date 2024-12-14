import React, { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const AddBrandModal = ({ isOpen, onClose, onAddBrand }) => {
  const [brandName, setBrandName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [errors, setErrors] = useState({});

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleSubmit = () => {
    if (!brandName.trim() || !uploadFile) {
      setErrors({
        brandName: !brandName.trim() ? "Tên thương hiệu là bắt buộc." : "",
        brandImage: !uploadFile ? "Hình ảnh là bắt buộc." : "",
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", brandName.trim());
    formData.append("image", uploadFile);

    onAddBrand(formData);
console.log(formData)
    // Reset fields
    setBrandName("");
    setUploadFile(null);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} handler={onClose}>
      <div className="p-6 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Thêm Thương Hiệu</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="brandName" className="block text-sm font-medium text-gray-700">
            Tên Thương Hiệu
          </label>
          <input
            type="text"
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
          {errors.brandName && <p className="text-sm text-red-500">{errors.brandName}</p>}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Hình Ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />
          {errors.brandImage && <p className="text-sm text-red-500">{errors.brandImage}</p>}
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

export default AddBrandModal;
