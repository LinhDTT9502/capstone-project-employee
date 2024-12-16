import React from "react";

export default function WarehouseActions() {
  return (
    <div>
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
      </div>
    </div>
  );
}
