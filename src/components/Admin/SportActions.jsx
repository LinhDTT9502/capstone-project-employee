import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const SportActions = ({ sport, onEdit, onDelete }) => {
  return (
    <div className="flex gap-2">
      <button
        className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={onEdit}
      >
        <FontAwesomeIcon icon={faEdit} className="mr-1" />
        Sửa
      </button>
      <button
        className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
        onClick={onDelete}
      >
        <FontAwesomeIcon icon={faTrash} className="mr-1" />
        Xóa
      </button>
    </div>
  );
};

export default SportActions;
