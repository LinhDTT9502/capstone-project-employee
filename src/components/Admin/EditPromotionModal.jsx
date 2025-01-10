import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSave } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const EditPromotionModal = ({ isOpen, onClose, onSave, promotion }) => {
  const [productName, setProductName] = useState("");
  const [discount, setDiscount] = useState("");

  useEffect(() => {
    if (promotion) {
      setProductName(promotion.productName || "");
      setDiscount(promotion.discount || "");
    }
  }, [promotion]);

  const handleSubmit = () => {
    if (!productName.trim() || discount === "") {
      toast.warning("Tên sản phẩm và mức khuyến mãi không được để trống.");
      return;
    }

    onSave(promotion.productName, parseInt(discount, 10)); 
    onClose();
  };

  return (
    <Dialog open={isOpen} handler={onClose} size="sm" className="bg-white shadow-none">
      <DialogHeader className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa Khuyến Mãi</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </DialogHeader>
      <DialogBody divider>
        <div className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
              Tên Sản Phẩm
            </label>
            <input
              type="text"
              id="productName"
              value={productName}
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
              Mức Khuyến Mãi (%)
            </label>
            <input
              type="number"
              id="discount"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <button
          onClick={onClose}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <FontAwesomeIcon icon={faSave} />
          Lưu
        </button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditPromotionModal;
