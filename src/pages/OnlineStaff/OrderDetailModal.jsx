import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';
import { getOrderDetail } from '../../services/Staff/OrderService';
import ProductOfBranch from '../../components/OnlineStaff/ProductOfBranch/ProductOfBranch';
import { toast } from 'react-toastify';

const OrderDetailModal = ({ open, onClose, orderId }) => {
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);


  useEffect(() => {
    if (open && orderId) {
      const fetchOrderDetail = async () => {
        try {
          setLoading(true);
          const response = await getOrderDetail(orderId);
          setOrderDetail(response);

        } catch (err) {
          setError('Failed to fetch order details');
        } finally {
          setLoading(false);
        }
      };

      fetchOrderDetail();
    }
  }, [open, orderId]);



  const handleAssignBranch = async () => {
    if (!selectedBranchId) {
      toast.warning('Vui lòng chọn chi nhánh cho đơn hàng');
      return;
    }

    try {
      const response = await fetch(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/assign-branch?orderId=${orderId}&branchId=${selectedBranchId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to assign branch. Please try again.');
      }

      toast.success('Branch assigned successfully!');
      onClose(); // Close the modal after successful assignment
    } catch (error) {
      console.error(error);
      toast.error('Error assigning branch. Please try again.');
    }
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';

    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');

    // Check if it matches Vietnamese phone number pattern
    const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);

    if (match) {
      // Return formatted as: 091-234-5678
      return `${match[1]}.${match[2]}.${match[3]}`;
    }
  };

  if (!open) return null;

  // Extract product IDs from the order details
  const productIds = orderDetail?.saleOrderDetailVMs?.$values.map((item) => item.productId) || [];

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Chi tiết đơn hàng - <span className="ml-1 text-orange-500 font-bold">#{orderDetail?.saleOrderCode}</span></DialogHeader>
      <DialogBody divider className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải...</p>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <p><strong>Khách hàng:</strong> {orderDetail?.fullName}</p>
            <p><strong>Email:</strong> {orderDetail?.email}</p>
            <p><strong>Phương thức nhận hàng:</strong> {orderDetail?.deliveryMethod}</p>
            <p><strong>Số điện thoại:</strong> {formatPhoneNumber(orderDetail?.contactPhone)}</p>
            <p><strong>Địa chỉ:</strong> {orderDetail?.address}</p>
            <p><strong>Tổng cộng:</strong> {orderDetail?.totalAmount.toLocaleString('vi-VN')} ₫</p>
            <h4 className="mt-4 mb-2">Sản phẩm:</h4>
            <ul>
              {orderDetail?.saleOrderDetailVMs?.$values.map((item) => (
                <li key={item.productId} className="mb-2">
                  <div className="flex items-center gap-4">
                    {console.log(item)}
                    <img src={item.imgAvatarPath} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" />

                    <div>
                      <p className="text-orange-500">
                        <strong>
                          {item.productName || "Unknown Product"}
                        </strong>
                      </p>
                      <p>
                        {item.color} - {item.size} - {item.condition}%
                      </p>
                      <p>
                        <span className="font-bold">Đơn giá: </span>
                        <span className="italic">{item.unitPrice.toLocaleString('vi-VN')} ₫</span>
                      </p>
                      <p>
                        <span className="font-bold">Số lượng: </span>
                        <span>{item.quantity}</span>
                      </p>
                      <p>
                        <span className="font-bold">Tạm tính: </span>
                        <span className="italic">{item.totalAmount.toLocaleString('vi-VN')} ₫</span>
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pass productIds to ProductOfBranch */}
            <ProductOfBranch
              selectedBranchId={selectedBranchId}
              setSelectedBranchId={setSelectedBranchId}
              productIds={productIds}
              orderId={orderId}
              selectedProducts={orderDetail.saleOrderDetailVMs.$values}
            />
          </div>
        )}
      </DialogBody>
      <DialogFooter>
        <Button color="green" onClick={handleAssignBranch}>Bàn giao</Button>
        <Button color="red" onClick={onClose}>Đóng</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default OrderDetailModal;
