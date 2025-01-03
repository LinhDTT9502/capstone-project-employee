import React, { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faPlus, faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { createFolder, uploadImagesToFolder } from "../../services/Manager/imageManagementService"; // Make sure this path is correct
import { toast } from "react-toastify";

const AddImageModal = ({ folderName, isOpen, onClose, setIsReload }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);

  const handleSubmit = async () => {
    if (images.length === 0) {
      setErrors({
        images: images.length === 0 ? "Vui lòng thêm ảnh." : "",
      });
      return;
    }

    setLoading(true);

    try {
      console.log(images);

      await uploadImagesToFolder(folderName, images); // Call createFolder from imageManagementService
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
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
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
          <h3 className="text-lg font-semibold">Thêm Ảnh</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="overflow-x-auto mt-1 flex items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md relative h-40">
          <label
            htmlFor="gallery-upload"
            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ml-4"
          >
            <span>Thêm ảnh</span>
            <input
              id="gallery-upload"
              name="gallery-upload"
              type="file"
              className="sr-only"
              multiple
              onChange={handleImagesUpload}
            />
          </label>
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow text-center">
              <FontAwesomeIcon
                icon={faCloudUploadAlt}
                className="h-12 w-12 text-gray-400 mb-2"
              />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="gallery-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Tải ảnh</span>
                  <input
                    id="gallery-upload"
                    name="gallery-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleImagesUpload}
                  />
                </label>
                <p className="pl-1">hoặc kéo và thả</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF</p>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex-grow">
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative flex-shrink-0 h-24 w-24 rounded-lg overflow-hidden"
                    >
                      <img
                        src={img instanceof File ? URL.createObjectURL(img) : img}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 p-1 text-black hover:text-red-500 focus:outline-none"
                        onClick={() => removeImage(index)}
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
            Thêm ảnh
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddImageModal;
