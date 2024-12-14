import React, { useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const AddSportModal = ({ isOpen, onClose, onAddSport }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Tên môn thể thao không được để trống!", { position: "top-right" });
      return;
    }
    onAddSport({ name: name.trim() });
    setName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} handler={onClose}>
      <div className="p-6 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Thêm Môn Thể Thao</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className="mt-4">
          <label htmlFor="sportName" className="block text-sm font-medium text-gray-700">
            Tên Môn Thể Thao
          </label>
          <input
            type="text"
            id="sportName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-2 border rounded px-3 py-2"
          />
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

export default AddSportModal;
