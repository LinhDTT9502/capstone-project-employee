import React, { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { deleteCategoryById } from "../../services/categoryService";
import { deleteAnImageInFolderAPI } from "../../api/Manager/apiManageImages";
import { deleteFolder } from "../../services/Manager/imageManagementService";




const ConfirmDeleteFolderModal = ({ isOpen, onClose, folder, setIsReload }) => {
    const [loading, setLoading] = useState(false);

    const handleConfirmDeleteFolder = async () => {
        try {
            setLoading(true)
            console.log(folder);

            await deleteFolder(folder);
            toast.success("Xóa thư mục thành công!", { position: "top-right" });
        } catch (error) {
            toast.error("Xóa thư mục thất bại!", { position: "top-right" });
        } finally {
            setIsReload(true);
            onClose();
        }
    }

    return (
        <Dialog open={isOpen} handler={onClose}>
            {loading && (
                <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
                    <span className="text-white ml-4">Đang xử lý...</span>
                </div>
            )}
            <div className="p-6 bg-white rounded shadow-lg w-full">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold font-bold">Xác Nhận Xóa</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-xl text-gray-700 font-bold">
                        Bạn chắc chắn muốn xóa thư mục '{folder}' không?
                    </p>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleConfirmDeleteFolder}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                    >
                        <FontAwesomeIcon icon={faTrash} className="mr-1" />
                        Xóa
                    </button>
                </div>
            </div>
        </Dialog>
    );
};

export default ConfirmDeleteFolderModal;
