import React from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { removeSport } from "../../api/apiSport";




const ConfirmDeleteSportModal = ({ isOpen, onClose, sport, setIsReload }) => {
    console.log(sport);

    const handleConfirmDeleteSport = async () => {
        try {

            await removeSport(sport.id);
            toast.success("Xóa môn thể thao thành công!", { position: "top-right" });
            setIsReload(true);
            onClose();
        } catch (error) {
            toast.error("Xóa môn thể thao thất bại!", { position: "top-right" });
        }
    }

    return (
        <Dialog open={isOpen} handler={onClose}>
            <div className="p-6 bg-white rounded shadow-lg w-full">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold font-bold">Xác Nhận Xóa</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-xl text-gray-700 font-bold">
                        Bạn chắc chắn muốn xóa môn thể thao ({sport.name}) không?
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
                        onClick={handleConfirmDeleteSport}
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

export default ConfirmDeleteSportModal;
