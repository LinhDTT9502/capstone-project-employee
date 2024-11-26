// src/components/OrderDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import HeaderStaff from '../../layouts/HeaderStaff';
import SidebarStaff from '../../layouts/SidebarStaff';
import { Button, Option, Select, Step, Stepper } from '@material-tailwind/react';
import { approveOrder, rejectOrder } from '../../services/Staff/OrderService';

const ORDER_STEPS = [
  { id: 1, label: 'PENDING' },
  { id: 2, label: 'CONFIRMED' },
  { id: 3, label: 'PAID' },
  { id: 4, label: 'PROCESSING' },
  { id: 5, label: 'SHIPPED' },
  { id: 6, label: 'COMPLETED' },
];

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);
  const [reload, setReload] = useState(false);
  console.log(user);

  const [newStatus, setNewStatus] = useState(null); // State for selected status
  const [updating, setUpdating] = useState(false);
  const isStaffOrAdmin = user && (user.role === 'Order Coordinator' || user.role === 'Admin');
  const statusOptions = [
    { label: 'CANCELLED', value: 0 },
    { label: 'PENDING', value: 1 },
    { label: 'CONFIRMED', value: 2 },
    { label: 'PAID', value: 3 },
    { label: 'PROCESSING', value: 4 },
    { label: 'SHIPPED', value: 5 },
    { label: 'DELAYED', value: 6 },
    { label: 'COMPLETED', value: 7 },
  ];

  const getCurrentStepIndex = (orderStatus) => {
    const step = ORDER_STEPS.find((step) => step.label === orderStatus);
    return step ? step.id - 1 : 0; // Return 0 if not found (safe default)
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(
          `https://twosportapi-295683427295.asia-southeast2.run.app/api/SaleOrder/get-sale-order-detail?orderId=${orderId}`
        );
        if (response.data.isSuccess) {
          setOrder(response.data.data);
        } else {
          setError('Failed to retrieve order details');
        }
      } catch (error) {
        setError('Error fetching order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [orderId, reload]);

  const handleStatusChange = async () => {
    if (newStatus === null || updating) return;

    setUpdating(true);
    try {
      const response = await axios.put(
        `https://twosportapi-295683427295.asia-southeast2.run.app/api/SaleOrder/update-order-status?orderId=${order.saleOrderId}&status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.data.isSuccess) {
        setOrder({ ...order, orderStatus: newStatus }); // Update order status locally
        alert('Order status updated successfully');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      alert('Error updating order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleApprove = async () => {
    const response = await approveOrder(orderId)
    setReload(prev => !prev);
    console.log(response);

  }

  const handleReject = async () => {
    const response = await rejectOrder(orderId)
    setReload(prev => !prev);
    console.log(response);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <HeaderStaff />
      <div className="flex h-full">
        {isStaffOrAdmin && <SidebarStaff />}
        <div className="flex-grow border-l-2 p-4">
          <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
            {/* Header with Order ID and Status */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Order Details #{order.orderCode}</h2>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-semibold rounded-full">
                  {order.orderStatus}
                </span>
                <select
                  onChange={(e) => setNewStatus(e.target.value)}
                  value={newStatus || order.orderStatus}
                  className="w-36 px-2 py-1 border rounded"
                >
                  <option>choose status</option>
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>

                <Button onClick={handleStatusChange} disabled={updating} color="blue">
                  {updating ? 'Updating...' : 'Change Status'}
                </Button>
              </div>
            </div>

            {/* Order Progress */}
            <div className="mb-6">
              <Stepper activeStep={getCurrentStepIndex(order.orderStatus)} color="blue">
                {ORDER_STEPS.map((status, index) => (
                  <Step key={index} completed={index < getCurrentStepIndex(order.orderStatus)}>
                    <div className="flex flex-col items-center">
                      <div>{status.id}</div>
                    </div>
                  </Step>
                ))}
              </Stepper>
            </div>

            {/* Items Ordered */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Ordered Products</h3>
              <ul>
                {order.saleOrderDetailVMs.$values.map((item) => (
                  <li key={item.productId} className="flex items-center justify-between py-4 border-b">
                    <div className="flex items-center space-x-4">
                      <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <p className="font-semibold">{item.productName}</p>
                        <p className="text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{item.totalPrice.toLocaleString()} VND</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between py-2">
                <p>Subtotal</p>
                <p className="font-semibold">{order.subTotal.toLocaleString()} VND</p>
              </div>
              <div className="flex justify-between py-2">
                <p>Shipping Fee</p>
                <p className="font-semibold text-green-600">Free</p>
              </div>
              <div className="flex justify-between py-2 border-t mt-4 pt-4">
                <p className="font-bold">Total</p>
                <p className="font-bold text-lg">{order.totalAmount.toLocaleString()} VND</p>
              </div>
            </div>
            {order.orderStatus === 'PENDING' && <> 
              <Button color="green" onClick={handleApprove}>Approve</Button>
              <Button color="red" onClick={handleReject}>Reject</Button>
            </>}
                
          </div>
        </div>

        {/* Right Side - Customer Info & Summary */}
        <div className="w-1/4 p-4">
          <div className="container mx-auto bg-white shadow-lg rounded-lg p-4">
            {/* Customer Information */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">Customer Information</h3>
              <p><strong>Name:</strong> {order.fullName}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.contactPhone}</p>
              <p><strong>Address:</strong> {order.address}</p>
            </div>

            {/* Order Summary */}
            <div className="mb-6 border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
              <p><strong>Subtotal:</strong> {order.subTotal.toLocaleString()} VND</p>
              <p><strong>Discount:</strong> 0.00 VND</p>
              <p><strong>Shipping Fee:</strong> Free</p>
              <p><strong>Total:</strong> {order.totalAmount.toLocaleString()} VND</p>
              <p><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
              <p><strong>branch:</strong> {order.branchId}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            </div>

            {/* Additional Details */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Additional Information</h3>
              <p><strong>Order Note:</strong> {order.note}</p>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Payment Date:</strong></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
