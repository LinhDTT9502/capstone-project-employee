import React, { useState, useEffect } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { updateBrand } from "../../services/brandService";

const EditBrandModal = ({ isOpen, onClose, brand, setIsReload }) => {
  const [brandName, setBrandName] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token")
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (brand) {
      console.log(brand);

      setBrandName(brand.brandName || ""); // Ensure `brandName` field matches backend requirements
      setUploadFile(brand.logo || "");
    }
  }, [brand]);

  const removeMainImage = () => {
    setUploadFile(null);
  };

  const handleSubmit = async () => {
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
      setLoading(true);
      try {
        await updateBrand(brand.id, formData, token);
        toast.success("Cập nhật thương hiệu thành công!", { position: "top-right" });
      } catch (error) {
        toast.error("Cập nhật thương hiệu thất bại!", { position: "top-right" });
      } finally {
        setLoading(false);
        setIsReload(true);
      }
    } else {
      console.error("Brand ID is not available");
    }

    setErrors({});
    onClose();
  };


  return (
    <Dialog open={isOpen} handler={onClose}>
      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
          <span className="text-white ml-4">Đang xử lý...</span>
        </div>
      )}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh thương hiệu</label>
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
