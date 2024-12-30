import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@material-tailwind/react";

const CommentActions = ({ comment, onView, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <Button
        size="md"
        color="blue"
        variant="text"
        className="flex items-center gap-2 px-2 py-2"
        onClick={onView}
      >
        <FontAwesomeIcon icon={faEye} className="text-sm	" />
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

export default CommentActions;
