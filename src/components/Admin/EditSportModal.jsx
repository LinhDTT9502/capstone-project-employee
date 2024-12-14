import React, { useState, useEffect } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

const EditSportModal = ({ isOpen, onClose, onEditSport, sport }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (sport) {
      setName(sport.name || "");
    }
  }, [sport]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Tên môn thể thao không được để trống.");
      return;
    }
    onEditSport(sport.id, { name: name.trim() });
    setName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} handler={onClose}>
      <div className="p-6 bg-white rounded shadow-lg">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold">Chỉnh Sửa Môn Thể Thao</h3>
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

export default EditSportModal;
