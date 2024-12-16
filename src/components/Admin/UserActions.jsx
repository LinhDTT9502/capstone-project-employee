import React from "react";
import { Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

const UserActions = ({ user, onEdit, onDelete, onView }) => {
  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        color="blue"
        variant="text"
        className="flex items-center gap-2"
        onClick={onView} // Add onView handler
      >
        <FontAwesomeIcon icon={faEye} />
        Xem
      </Button>
      <Button
        size="sm"
        color="blue"
        variant="text"
        className="flex items-center gap-2"
        onClick={onEdit}
      >
        <FontAwesomeIcon icon={faPen} />
        Chỉnh sửa
      </Button>
      <Button
        size="sm"
        color="red"
        variant="text"
        className="flex items-center gap-2"
        onClick={onDelete}
      >
        <FontAwesomeIcon icon={faTrash} />
        Xóa
      </Button>
    </div>
  );
};

export default UserActions;
