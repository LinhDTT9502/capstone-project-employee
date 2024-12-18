import React from "react";
import { Switch } from "@material-tailwind/react";

const ChangeProductStatusButton = ({ productId, isActive, onChangeStatus }) => {
  const handleToggle = () => {
    const confirmationMessage = isActive
      ? "Bạn có chắc chắn muốn vô hiệu hóa sản phẩm này không?"
      : "Bạn có chắc chắn muốn kích hoạt sản phẩm này không?";

    if (window.confirm(confirmationMessage)) {
      console.log('change status')
      onChangeStatus(productId, !isActive);
    }
  };

  return (
    // <Button
    //   size="sm"
    //   className={isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
    //   onClick={handleClick}
    // >
    //   {isActive ? "Hoạt động" : "Vô hiệu hóa"}
    // </Button>
    <div className="flex items-center gap-4">
      <Switch
        className={isActive ? "bg-green-500" : "bg-red-500"} // Conditional class
        checked={isActive}
        onChange={handleToggle}
      />
    </div>
  );
};

export default ChangeProductStatusButton;
