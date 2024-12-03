import React, { useEffect, useState } from 'react';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from '@material-tailwind/react';
import { getOrderDetail } from '../../services/Staff/OrderService';
import ProductOfBranch from '../../components/OnlineStaff/ProductOfBranch/ProductOfBranch';
import { getRentalDetail } from '../../services/Staff/RentalService';

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
            setOrderId(data.id)
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
            setError('Failed to fetch order details');
          }
        } catch (err) {
          setError('Failed to fetch order details');
        } finally {
          setLoading(false);
        }
      };

      fetchOrderDetail();
    }
  }, [open, orderCode]);

  const handleAssignBranch = async () => {
    if (!selectedBranchId) {
      alert('Please select a branch first!');
      return;
    }

    try {
      const response = await fetch(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/assign-branch?orderId=${orderId}&branchId=${selectedBranchId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            accept: '*/*',
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

  return (
    <Dialog open={open} handler={onClose}>
      <DialogHeader>Order Detail: {orderCode}</DialogHeader>
      <DialogBody divider className="max-h-[70vh] overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <p><strong>Customer:</strong> {customerInfo.fullName}</p>
            <p><strong>Email:</strong> {customerInfo.email}</p>
            <p><strong>Delivery Method:</strong> {customerInfo.deliveryMethod}</p>
            <p><strong>Phone:</strong> {customerInfo.contactPhone}</p>
            <p><strong>Address:</strong> {customerInfo.address}</p>
            <h4 className="mt-4 mb-2">Products:</h4>
            <ul>
              {childOrders.map((order) => (
                <li key={order.id} className="mb-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={order.imgAvatarPath || 'https://via.placeholder.com/100'}
                      alt={order.productName || 'Product'}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <p><strong>{order.productName || 'Unknown Product'}</strong></p>
                      <p>Rent Price: {order.rentPrice ? order.rentPrice.toLocaleString() : 'N/A'}</p>
                      <p>Subtotal: {order.subTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <ProductOfBranch
              selectedBranchId={selectedBranchId}
              setSelectedBranchId={setSelectedBranchId}
              productIds={childOrders.map((order) => order.productId).filter(Boolean)}
              orderCode={orderCode}
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

export default RentalDetailModal;
