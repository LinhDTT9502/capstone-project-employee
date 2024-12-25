import React, { useState } from "react";
import { Switch } from "@material-tailwind/react";
import { changeProductStatus } from "../../services/productService";
import { toast } from "react-toastify";

const ChangeProductStatusButton = ({ product, isActive: initialStatus }) => {
  const [isActive, setIsActive] = useState(initialStatus); // Local state to manage the toggle status

  const handleToggle = async () => {
    try {
      const response = await changeProductStatus(product.id);

      if (response.status === 200) {
        setIsActive((prev) => !prev); // Toggle the local state
        toast.success("Thay đổi trạng thái thành công!");
      } else {
        toast.error("Thay đổi trạng thái thất bại!");
      }
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Lỗi xảy ra khi thay đổi trạng thái.");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Switch
        className={isActive ? "bg-green-500" : "bg-red-500"} // Conditional class
        checked={isActive}
        onChange={handleToggle} // Trigger toggle handler
      />
    </div>
  );
};

export default ChangeProductStatusButton;
