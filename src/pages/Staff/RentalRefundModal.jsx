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
    } else if (open && orderCode) {
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
      <DialogHeader className="bg-gray-100 text-gray-800 px-6 py-4 rounded-t-lg">
        <h2 className="text-2xl font-bold">Chi tiết đơn hàng: #{orderCode || rentalCode}</h2>
      </DialogHeader>
      <DialogBody divider className="max-h-[70vh] overflow-y-auto px-6 py-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {orderDetails ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Thông tin khách hàng</h3>
                <p><span className="font-medium">Họ và tên:</span> {orderDetails.fullName}</p>
                <p><span className="font-medium">Giới tính:</span> {orderDetails.gender}</p>
                <p><span className="font-medium">Địa chỉ:</span> {orderDetails.address}</p>
                <p><span className="font-medium">Số điện thoại:</span> {orderDetails.contactPhone}</p>
                <p><span className="font-medium">Email:</span> {orderDetails.email}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Thông tin đơn hàng</h3>
                <p><span className="font-medium">Chi nhánh:</span> {orderDetails.branchName}</p>
                <p><span className="font-medium">Trạng thái:</span> <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{orderDetails.orderStatus}</span></p>
                <p><span className="font-medium">Ngày tạo:</span> {new Date(orderDetails.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}</p>
                   <p><span className="font-medium">Thời gian thuê:</span> {new Date(orderDetails.rentalStartDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })} - {new Date(orderDetails.rentalEndDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
                </p>
                <p><span className="font-medium">Phương thức giao hàng:</span> {orderDetails.deliveryMethod}</p>
                <p><span className="font-medium">Tình trạng thanh toán:</span> <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">{orderDetails.paymentStatus}</span></p>
                <p><span className="font-medium">Phương thức thanh toán:</span> {orderDetails.paymentMethod || "Không xác định"}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Ghi chú</h3>
              <p className="italic text-gray-600">{orderDetails.note || "Không có ghi chú"}</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">Chi tiết chi phí</h3>
              <div className="grid grid-cols-2 gap-4">
                <p><span className="font-medium">Giá thuê:</span> {orderDetails.rentPrice?.toLocaleString('vi-VN') || 0} ₫</p>
                <p><span className="font-medium">Phí trễ hạn:</span> {orderDetails.lateFee?.toLocaleString('vi-VN')} ₫</p>
                <p><span className="font-medium">Phí vận chuyển:</span> {orderDetails.tranSportFee?.toLocaleString('vi-VN')} ₫</p>
                <p className="col-span-2"><span className="font-medium text-lg">Tổng cộng:</span> <span className="text-xl font-bold text-green-600">{orderDetails.totalAmount?.toLocaleString('vi-VN')} ₫</span></p>
              </div>
            </div>

            {orderDetails.childOrders && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Chi tiết sản phẩm</h3>
                <div className="grid gap-4">
                  {orderDetails.childOrders.$values.map((child, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-150">
                      <p><span className="font-medium">Tên sản phẩm:</span> {child.productName || "Không xác định"}</p>
                      <p><span className="font-medium">Số lượng:</span> {child.quantity}</p>
                      <p><span className="font-medium">Mã sản phẩm:</span> {child.productCode}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </DialogBody>
      <DialogFooter className="px-6 py-4">
        <Button 
          color="red" 
          onClick={onClose}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-150"
        >
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default RentalRefundModal;