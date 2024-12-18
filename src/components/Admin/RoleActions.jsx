import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@material-tailwind/react";

const RoleActions = ({ role, onEdit, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <Button
        size="md"
        color="black"
        variant="text"
        className="flex items-center gap-2 px-2 py-2"
        onClick={onEdit}
      >
        <FontAwesomeIcon icon={faPen} className="text-sm	" />
      </Button>
      <Button
        size="md"
        color="red"
        variant="text"
        className="flex items-center gap-2 px-2 py-2"
        onClick={onDelete}
      >
        <FontAwesomeIcon icon={faTrash} className="text-sm	" />
      </Button>
    </div>
  );
};

export default RoleActions;
