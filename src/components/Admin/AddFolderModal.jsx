import React, { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { createFolder } from "../../services/Manager/imageManagementService"; // Make sure this path is correct
import { toast } from "react-toastify";

const AddFolderModal = ({ isOpen, onClose, setIsReload }) => {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    if (!folderName.trim()) {
      setErrors({
        folderName: !folderName.trim() ? "Tên thư mục là bắt buộc." : "",
      });
      return;
    }

    setLoading(true);

    try {
      console.log(folderName.trim());

      await createFolder(folderName.trim()); // Call createFolder from imageManagementService
      toast.success("Thêm thư mục thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Thêm thư mục thất bại!", { position: "top-right" });
      console.error(error);

    } finally {
      setIsReload(true);
      setLoading(false);
    }

    setFolderName("");
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
          <h3 className="text-lg font-semibold">Thêm Thư Mục</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="folderName" className="block text-sm font-medium text-gray-700">
            Tên Thư Mục
          </label>
          <input
            type="text"
            id="folderName"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
          {errors.folderName && <p className="text-sm text-red-500">{errors.folderName}</p>}
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
            Tạo thư mục
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default AddFolderModal;
