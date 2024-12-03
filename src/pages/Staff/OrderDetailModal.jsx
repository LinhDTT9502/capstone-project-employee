import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';
import { getOrderDetail } from '../../services/Staff/OrderService';
import ProductOfBranch from '../../components/OnlineStaff/ProductOfBranch/ProductOfBranch';

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
      alert('Please select a branch first!');
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

      alert('Branch assigned successfully!');
      onClose(); // Close the modal after successful assignment
    } catch (error) {
      console.error(error);
      alert('Error assigning branch. Please try again.');
    }
  };

  if (!open) return null;

  // Extract product IDs from the order details
  const productIds = orderDetail?.saleOrderDetailVMs?.$values.map((item) => item.productId) || [];

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Order Detail: {orderDetail?.orderCode}</DialogHeader>
      <DialogBody divider className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <p><strong>Customer:</strong> {orderDetail?.fullName}</p>
            <p><strong>Email:</strong> {orderDetail?.email}</p>
            <p><strong>deliveryMethod:</strong> {orderDetail?.deliveryMethod}</p>
            <p><strong>Phone:</strong> {orderDetail?.contactPhone}</p>
            <p><strong>Address:</strong> {orderDetail?.address}</p>
            <p><strong>Total Amount:</strong> {orderDetail?.totalAmount.toLocaleString()}</p>
            <h4 className="mt-4 mb-2">Products:</h4>
            <ul>
              {orderDetail?.saleOrderDetailVMs?.$values.map((item) => (
                <li key={item.productId} className="mb-2">
                  <div className="flex items-center gap-4">
                    <img src={item.imgAvatarPath} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <p><strong>{item.productName}</strong></p>
                      <p>Quantity: {item.quantity}</p>
                      {/* <p>Unit Price: {item.unitPrice.toLocaleString()}</p>
                      <p>Total Price: {item.totalPrice.toLocaleString()}</p> */}
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
            />
          </div>
        )}
      </DialogBody>
      <DialogFooter>
      <Button color="green" onClick={handleAssignBranch}>Assign Branch</Button>
        <Button color="red" onClick={onClose}>Close</Button>
      </DialogFooter>
    </Dialog>
  );
};

export default OrderDetailModal;
