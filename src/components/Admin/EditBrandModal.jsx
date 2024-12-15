import React, { useState, useEffect } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const EditBrandModal = ({ isOpen, onClose, onEditBrand, brand }) => {
  const [brandName, setBrandName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (brand) {
      setBrandName(brand.brandName || ""); // Ensure `brandName` field matches backend requirements
      setCurrentImage(brand.imagePath || "");
    }
  }, [brand]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
    }
  };

  const handleSubmit = () => {
    if (!brandName.trim()) {
      setErrors({ brandName: "Tên thương hiệu là bắt buộc." });
      return;
    }
  
    const formData = new FormData();
    formData.append("BrandName", brandName.trim());
  
    if (uploadFile) {
      formData.append("LogoImage", uploadFile);
    }
  
    console.log("FormData content: ", [...formData]);
  
    if (brand && brand.id) {
      onEditBrand(brand.id, formData); // Use brand.id as the brandId
    } else {
      console.error("Brand ID is not available");
    }
  
    setErrors({});
    onClose();
  };
  
  
  return (
    <Dialog open={isOpen} handler={onClose}>
      <div className="p-6 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Chỉnh Sửa Thương Hiệu</h3>
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
          {uploadFile && (
            <p className="text-sm text-green-500 mt-2">
              Đã chọn tệp: <strong>{uploadFile.name}</strong>
            </p>
          )}
          {!uploadFile && currentImage && (
            <img
              src={currentImage}
              alt="Current"
              className="mt-2 h-20 w-20 object-cover rounded"
            />
          )}
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

export default EditBrandModal;
