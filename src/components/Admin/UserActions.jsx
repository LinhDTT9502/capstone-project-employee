import React from "react";
import { Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

const UserActions = ({ user, onEdit, onDelete, onView }) => {
  return (
    <div className="flex space-x-2">
  <Button
    size="md"
    color="blue"
    variant="text"
    className="flex items-center gap-2 px-4 py-2" 
    onClick={onView}
  >
    <FontAwesomeIcon icon={faEye} className="text-sm	" /> 
  </Button>
  <Button
    size="md"
    color="black"
    variant="text"
    className="flex items-center gap-2 px-4 py-2"
    onClick={onEdit}
  >
    <FontAwesomeIcon icon={faPen} className="text-sm	" />
  </Button>
  <Button
    size="md"
    color="red"
    variant="text"
    className="flex items-center gap-2 px-4 py-2"
    onClick={onDelete}
  >
    <FontAwesomeIcon icon={faTrash} className="text-sm	" />
  </Button>
</div>

  );
};

export default UserActions;
