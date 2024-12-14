import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { getRentalDetail } from "../../services/Staff/RentalService";
import { getOrderbyCode } from "../../services/Staff/OrderService";

const RentalRefundModal = ({ open, onClose, orderCode, rentalCode }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && rentalCode) {
      const fetchOrderDetail = async () => {
        try {
          const response = await getRentalDetail(rentalCode);
          setOrderDetails(response.data);
        } catch (err) {
          setError("Failed to fetch order details");
        }
      };

      fetchOrderDetail();
    } else if (open && orderCode){
      const fetchOrderDetail = async () => {
        try {
          const response = await getOrderbyCode(orderCode);
          setOrderDetails(response);
        } catch (err) {
          setError("Failed to fetch order details");
        }
      };

      fetchOrderDetail();
    }
  }, [open, orderCode]);

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader>
        Chi tiết đơn hàng: {orderCode}
      </DialogHeader>
      <DialogBody divider className="max-h-[70vh] overflow-y-auto">
        {error && <p className="text-red-500">{error}</p>}
        {orderDetails ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <p><strong>Họ và tên:</strong> {orderDetails.fullName}</p>
              <p><strong>Giới tính:</strong> {orderDetails.gender}</p>
            </div>
            <p><strong>Địa chỉ:</strong> {orderDetails.address}</p>
            <p><strong>Số điện thoại:</strong> {orderDetails.contactPhone}</p>
            <p><strong>Email:</strong> {orderDetails.email}</p>
            <p><strong>Chi nhánh:</strong> {orderDetails.branchName}</p>
            <p><strong>Trạng thái đơn hàng:</strong> {orderDetails.orderStatus}</p>
            <p><strong>Ngày tạo:</strong> {new Date(orderDetails.createdAt).toLocaleDateString()}</p>
            <p><strong>Phương thức giao hàng:</strong> {orderDetails.deliveryMethod}</p>
            <p><strong>Tình trạng thanh toán:</strong> {orderDetails.paymentStatus}</p>
            <p><strong>Phương thức thanh toán:</strong> {orderDetails.paymentMethod || "Không xác định"}</p>
            <p><strong>Ghi chú:</strong> {orderDetails.note || "Không có"}</p>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium">Chi tiết chi phí:</h3>
              <p><strong>Giá thuê:</strong> {orderDetails.rentPrice || 0} VND</p>
              <p><strong>Phí trễ hạn:</strong> {orderDetails.lateFee} VND</p>
              <p><strong>Phí vận chuyển:</strong> {orderDetails.tranSportFee} VND</p>
              <p><strong>Tổng cộng:</strong> {orderDetails.totalAmount} VND</p>
            </div>

            {orderDetails.childOrders && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium">Chi tiết sản phẩm:</h3>
                {orderDetails.childOrders.$values.map((child, index) => (
                  <div key={index} className="p-2 border rounded-md mb-2">
                    <p><strong>Tên sản phẩm:</strong> {child.productName || "Không xác định"}</p>
                    <p><strong>Số lượng:</strong> {child.quantity}</p>
                    <p><strong>Mã sản phẩm:</strong> {child.productCode}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p>Đang tải thông tin...</p>
        )}
      </DialogBody>
      <DialogFooter>
        <Button color="red" onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default RentalRefundModal;