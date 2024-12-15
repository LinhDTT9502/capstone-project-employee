import React from "react";
import { Button } from "@material-tailwind/react";

const ChangeStatusButton = ({ userId, isActive, onChangeStatus }) => {
  const handleClick = () => {
    const confirmationMessage = isActive
      ? "Bạn có chắc chắn muốn vô hiệu hóa người dùng này không?"
      : "Bạn có chắc chắn muốn kích hoạt người dùng này không?";

    if (window.confirm(confirmationMessage)) {
      onChangeStatus(userId, !isActive); // Toggle status
    }
  };

  return (
    <Button
      size="sm"
      className={isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
      onClick={handleClick}
    >
      {isActive ? "Hoạt động" : "Vô hiệu hóa"}
    </Button>
  );
};

export default ChangeStatusButton;
