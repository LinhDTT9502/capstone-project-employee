import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { getOrderDetail } from "../../services/Staff/OrderService";
import ProductOfBranch from "../../components/OnlineStaff/ProductOfBranch/ProductOfBranch";
import { getRentalDetail } from "../../services/Staff/RentalService";

const RentalDetailModal = ({ open, onClose, orderCode }) => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [childOrders, setChildOrders] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    if (open && orderCode) {
      const fetchOrderDetail = async () => {
        try {
          setLoading(true);
          const response = await getRentalDetail(orderCode);
          console.log(response);

          if (response?.isSuccess) {
            const data = response.data;
            setOrderId(data.id);
            // Check for child orders
            if (data.childOrders?.$values.length > 0) {
              setCustomerInfo({
                fullName: data.fullName,
                email: data.email,
                contactPhone: data.contactPhone,
                address: data.address,
                deliveryMethod: data.deliveryMethod,
              });
              setChildOrders(data.childOrders.$values);
            } else {
              setCustomerInfo({
                fullName: data.fullName,
                email: data.email,
                contactPhone: data.contactPhone,
                address: data.address,
                deliveryMethod: data.deliveryMethod,
              });
              setChildOrders([data]); // Treat self as a single child order
            }
          } else {
            setError("Failed to fetch order details");
          }
        } catch (err) {
          setError("Failed to fetch order details");
        } finally {
          setLoading(false);
        }
      };

      fetchOrderDetail();
    }
  }, [open, orderCode]);

  const handleAssignBranch = async () => {
    if (!selectedBranchId) {
      alert("Please select a branch first!");
      return;
    }

    try {
      const response = await fetch(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/assign-branch?orderId=${orderId}&branchId=${selectedBranchId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to assign branch. Please try again.");
      }

      alert("Branch assigned successfully!");
      onClose(); // Close the modal after successful assignment
    } catch (error) {
      console.error(error);
      alert("Error assigning branch. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Chi tiết đơn hàng - <span className="ml-1 text-orange-500 font-bold">#{orderCode}</span></DialogHeader>
      <DialogBody divider className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">
              Đang tải...
            </p>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <p>
              <strong>Khách hàng:</strong> {customerInfo.fullName}
            </p>
            <p>
              <strong>Email:</strong> {customerInfo.email}
            </p>
            <p>
              <strong>Hình thức nhận hàng:</strong>{" "}
              {customerInfo.deliveryMethod}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {customerInfo.contactPhone}
            </p>
            <p>
              <strong>Địa chỉ :</strong> {customerInfo.address}
            </p>
            <h4 className="mt-4 mb-2 font-bold">Sản phẩm:</h4>
            <ul>
              {childOrders.map((order) => (
                <li key={order.id} className="mb-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        order.imgAvatarPath || "https://via.placeholder.com/100"
                      }
                      alt={order.productName || "Product"}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p className="text-orange-500">
                        <strong>
                          {order.productName || "Unknown Product"}
                        </strong>
                      </p>
                      <p>
                        {console.log(order)}
                        {order.color} - {order.size} - {order.condition}%
                      </p>
                      <p>
                        <span className="font-bold">Thời gian thuê:</span>{" "}
                        <span>
                          {new Date(order.rentalStartDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })} -{" "}
                          {new Date(order.rentalEndDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </span>

                      </p>
                      <p>
                        <span className="font-bold">Giá thuê:{" "}</span>
                        <span className="italic">
                          {order.rentPrice
                            ? order.rentPrice.toLocaleString('vi-VN')
                            : "N/A"}₫
                        </span>
                      </p>
                      <p>
                        <span className="font-bold">Tạm tính: </span>
                        <span className="italic">{order.subTotal.toLocaleString('vi-VN')}₫</span>

                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <ProductOfBranch
              selectedBranchId={selectedBranchId}
              setSelectedBranchId={setSelectedBranchId}
              productIds={childOrders
                .map((order) => order.productId)
                .filter(Boolean)}
              orderCode={orderCode}
              selectedProducts={childOrders}
            />
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button color="green" onClick={handleAssignBranch}>
          Bàn giao
        </Button>
        <Button color="red" onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default RentalDetailModal;
