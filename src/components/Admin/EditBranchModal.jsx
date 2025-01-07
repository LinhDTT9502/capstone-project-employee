import React, { useState, useEffect } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudUploadAlt, faPlus, faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { updateBranchAPI } from "../../api/apiBranch";
import { updateBranchById } from "../../services/branchService";

const EditBranchModal = ({ isOpen, onClose, branch, setIsReload }) => {
  const [branchName, setBranchName] = useState("");
  const [location, setLocation] = useState("");
  const [hotline, setHotLine] = useState("");
  const [uploadFile, setUploadFile] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (branch) {
      console.log(branch);

      setBranchName(branch.branchName || ""); // Ensure `branchName` field matches backend requirements
      setUploadFile(branch.imgAvatarPath || "");
      setLocation(branch.location || "");
      setHotLine(branch.hotline || "");
    }
  }, [branch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        alert("Loại tệp không hợp lệ. Vui lòng tải lên tệp PNG, JPG, GIF hoặc WEBP.");
        return;
      }

      // Create a preview URL
      setUploadFile(file);
    }
  };

  const removeImage = () => {
    setUploadFile(null);
  };

  const handleSubmit = async () => {
    if (!branchName.trim() || !location.trim() || !hotline.trim() || !uploadFile) {
      setErrors({
        branchName: !branchName.trim() ? "Tên chi nhánh là bắt buộc." : "",
        location: !location.trim() ? "Địa điểm là bắt buộc." : "",
        hotline: !hotline.trim() ? "Hotline là bắt buộc." : "",
        branchImage: !uploadFile ? "Hình ảnh là bắt buộc." : "",
      });
      return;
    }
    const formData = new FormData();
    console.log(branchName);

    formData.append("BranchName", branchName.trim());
    formData.append("Location", location.trim());
    formData.append("Hotline", hotline.trim());

    if (uploadFile) {
      formData.append("ImageURL", uploadFile);
    }

    try {
      console.log(formData);

      setLoading(true)
      const response = await updateBranchById(branch.id, formData);
      console.log(response);

      toast.success("Chỉnh sửa chi nhánh thành công!", { position: "top-right" });
      setIsReload(true);
      onClose();
    } catch (error) {
      console.log(error);
      toast.error("Chỉnh sửa chi nhánh thất bại!", { position: "top-right" });
      setLoading(false)
      onClose();
    }
  };


  return (
    <Dialog open={isOpen} onClose={onClose}>
      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
          <span className="text-white ml-4">Đang xử lý...</span>
        </div>
      )}
      <div className="p-6 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Thêm Chi Nhánh</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="branchName" className="block text-sm font-medium text-gray-700">
            Tên Chi Nhánh
          </label>
          <input
            type="text"
            id="branchName"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
          {errors.branchName && <p className="text-sm text-red-500">{errors.branchName}</p>}
        </div>
        <div className="mt-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Địa Điểm
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
          {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
        </div>
        <div className="mt-4">
          <label htmlFor="hotline" className="block text-sm font-medium text-gray-700">
            Hotline
          </label>
          <input
            type="text"
            id="hotline"
            value={hotline}
            onChange={(e) => setHotLine(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
          {errors.hotline && <p className="text-sm text-red-500">{errors.hotline}</p>}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Hình Ảnh</label>
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
                  onClick={removeImage}
                  className="absolute top-1 right-1 -mt-2 -mr-2 text-black p-1 hover:text-red-500"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <FontAwesomeIcon icon={faCloudUploadAlt} className="mx-auto h-12 w-12 text-gray-400" />
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
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">hoặc kéo và thả</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF
                </p>
              </div>
            )}
          </div>
          {errors.branchImage && <p className="text-sm text-red-500">{errors.branchImage}</p>}
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

export default EditBranchModal;
