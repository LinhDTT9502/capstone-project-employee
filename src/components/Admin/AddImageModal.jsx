import React, { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faPlus, faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { uploadImagesToFolder } from "../../services/Manager/imageManagementService";
import { toast } from "react-toastify";

const AddImageModal = ({ folderName, isOpen, onClose, setIsReload }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);

  const handleSubmit = async () => {
    if (images.length === 0) {
      setErrors({
        images: "Vui lòng thêm ảnh.",
      });
      return;
    }

    setLoading(true);

    try {
      await uploadImagesToFolder(folderName, images);
      toast.success("Thêm ảnh thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Thêm ảnh thất bại!", { position: "top-right" });
      console.error(error);
    } finally {
      setIsReload(true);
      setLoading(false);
    }

    setImages([]);
    setErrors({});
    onClose();
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
<Dialog open={isOpen} handler={onClose} size="lg">
      <div className="p-6 bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col">
        {loading && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 rounded-lg">
            <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
            <span className="text-white ml-4 text-lg">Đang xử lý...</span>
          </div>
        )}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Thêm Ảnh</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          <div className="mb-6">
            <div
              className="flex items-center justify-center w-full"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <label
                htmlFor="gallery-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FontAwesomeIcon icon={faCloudUploadAlt} className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Nhấp để tải ảnh</span> hoặc kéo và thả
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF (Tối đa 10MB)</p>
                </div>
                <input id="gallery-upload" type="file" className="hidden" multiple onChange={handleImagesUpload} />
              </label>
            </div>
          </div>

          {images.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-3">Ảnh đã chọn:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-60 overflow-y-auto pr-2">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img instanceof File ? URL.createObjectURL(img) : img}
                      alt={`Product ${index + 1}`}
                      className="h-24 w-full object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 p-1 bg-white rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errors.images && <p className="mt-2 text-sm text-red-600">{errors.images}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Thêm ảnh
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddImageModal;

