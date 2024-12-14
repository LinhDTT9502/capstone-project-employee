import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const BrandActions = ({ brand, onEdit, onDelete }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        <FontAwesomeIcon icon={faEdit} /> Chỉnh Sửa
      </button>
      <button
        onClick={onDelete}
        className="px-3 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
      >
        <FontAwesomeIcon icon={faTrash} /> Xóa
      </button>
    </div>
  );
};

export default BrandActions;
