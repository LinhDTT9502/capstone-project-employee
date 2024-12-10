// src/components/OrderDetail.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import HeaderStaff from '../../layouts/HeaderStaff';
import SidebarStaff from '../../layouts/SidebarStaff';
import { Button, Option, Select, Step, Stepper } from '@material-tailwind/react';
import { approveOrder, rejectOrder } from '../../services/Staff/OrderService';

const ORDER_STEPS = [
	{ id: 1, label: 'Chờ xử lý' },
	{ id: 2, label: 'Đã xác nhận' },
	{ id: 3, label: 'Đã thanh toán' },
	{ id: 4, label: 'Đang xử lý' },
	{ id: 5, label: 'Đã giao hàng' },
	{ id: 6, label: 'Hoàn thành' },
];

const OrderDetail = () => {
	const { orderId } = useParams();
	const navigate = useNavigate();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const user = useSelector(selectUser);
	const [reload, setReload] = useState(false);
	const [newStatus, setNewStatus] = useState(null); 
	const [updating, setUpdating] = useState(false);

	const isStaffOrAdmin =
		user && (user.role === 'Order Coordinator' || user.role === 'Admin' || user.role === 'Staff');

	const statusOptions = [
		{ label: 'Đã hủy', value: 0 },
		{ label: 'Chờ xử lý', value: 1 },
		{ label: 'Đã xác nhận', value: 2 },
		{ label: 'Đã thanh toán', value: 3 },
		{ label: 'Đang xử lý', value: 4 },
		{ label: 'Đã giao hàng', value: 5 },
		{ label: 'Bị trì hoãn', value: 6 },
		{ label: 'Hoàn thành', value: 7 },
	];

	const getCurrentStepIndex = (orderStatus) => {
		const step = ORDER_STEPS.find((step) => step.label === orderStatus);
		return step ? step.id - 1 : 0;
	};

	useEffect(() => {
		const fetchOrderDetail = async () => {
			try {
				const response = await axios.get(
					`https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/get-sale-order-detail?orderId=${orderId}`
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
		getCurrentStepIndex();
	}, [orderId, reload, statusOptions]);

	const handleStatusChange = async () => {
		if (newStatus === null || updating) return;

		setUpdating(true);
		try {
			const response = await axios.put(
				`https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/update-order-status?orderId=${orderId}&status=${newStatus}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${user.token}`,
					},
				}
			);
			if (response.data.isSuccess) {
				// Update order status locally without needing to reload
				setOrder((prevOrder) => ({ ...prevOrder, orderStatus: newStatus }));
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
		const response = await approveOrder(orderId);
		setReload((prev) => !prev);
		console.log(response);
	};

	const handleReject = async () => {
		const response = await rejectOrder(orderId);
		setReload((prev) => !prev);
		navigate(-1);
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p className='text-red-500'>{error}</p>;

	return (
		<>

			<div className='flex flex-col h-full md:flex-row'>


				<div className='flex-grow p-4 md:p-8'>
					<div className='container p-6 mx-auto bg-white shadow-lg rounded-xl'>
						<div className='flex items-center justify-between mb-6'>
							<h2 className='text-3xl font-semibold text-gray-800'>Order Details #{order.orderCode}</h2>
						</div>

						{/* Order Progress */}
						<div className='mb-8'>
							<Stepper activeStep={getCurrentStepIndex(order.orderStatus)} color='blue'>
								{ORDER_STEPS.map((status, index) => (
									<Step key={index} completed={index < getCurrentStepIndex(order.orderStatus)}>
										<div className='flex flex-col items-center'>
											<div className='text-xl font-semibold'>{status.id}</div>
										</div>
									</Step>
								))}
							</Stepper>
						</div>

						{/* Ordered Products */}
						<div className='mb-8'>
							<h3 className='mb-4 text-2xl font-semibold text-gray-800'>Ordered Products</h3>
							<ul>
								{order.saleOrderDetailVMs.$values.map((item) => (
									<li
										key={item.productId}
										className='flex items-center justify-between py-4 border-b border-gray-200'
									>
										<div className='flex items-center space-x-4'>
											<img
												src={item.imgAvatarPath}
												alt={item.productName}
												className='object-cover w-16 h-16 rounded-lg shadow-md'
											/>
											<div>
												<p className='font-semibold text-gray-700'>{item.productName}</p>
												<p className='text-gray-500'>Quantity: {item.quantity}</p>
											</div>
										</div>
									</li>
								))}
							</ul>
							<div className='flex items-center space-x-6'>
								<span className='px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full'>
									{order.orderStatus}
								</span>
								<select
									onChange={(e) => setNewStatus(e.target.value)}
									value={newStatus || order.orderStatus}
									className='px-4 py-2 transition duration-200 ease-in-out border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400'
								>
									<option>Choose Status</option>
									{statusOptions.map((status) => (
										<option key={status.value} value={status.value}>
											{status.label}
										</option>
									))}
								</select>
								<Button onClick={handleStatusChange} disabled={updating} color='blue'>
									{updating ? 'Updating...' : 'Change Status'}
								</Button>
							</div>
						</div>

						{/* Order Summary */}
						<div className='p-2 mt-8 rounded-lg bg-gray-50'>
							<div className='flex justify-between py-3'>
								<p className='text-lg font-medium text-gray-700'>Tạm tính</p>
								<p className='text-lg font-medium text-gray-700'>{order.totalAmount}</p>
							</div>
							<div className='flex justify-between py-3'>
								<p className='text-lg font-medium text-gray-700'>Phí vận chuyển</p>
								<p className='text-lg font-medium text-green-600'>Free</p>
							</div>
							<div className='flex justify-between py-3 pt-4 mt-4 border-t border-gray-200'>
								<p className='text-xl font-semibold'>Tổng cộng</p>
								<p className='text-xl font-semibold'>{order.totalAmount}</p>
							</div>
						</div>

						{order.orderStatus === 'Chờ xử lý' && order.deliveryMethod !== 'Đến cửa hàng nhận' && (
							<div className='mt-6 space-x-4'>
								<Button color='green' onClick={handleApprove}>
									Approve
								</Button>
								<Button color='red' onClick={handleReject}>
									Reject
								</Button>
							</div>
						)}
					</div>
				</div>

				<div className='w-full p-4 md:w-1/4'>
					<div className='container p-6 mx-auto bg-white rounded-lg shadow-lg'>
						<div className='pb-4 mb-6 border-b'>
							<h3 className='mb-2 text-xl font-semibold'>Customer Information</h3>
							<p>
								<strong>Name:</strong> {order.fullName}
							</p>
							<p>
								<strong>Email:</strong> {order.email}
							</p>
							<p>
								<strong>Phone:</strong> {order.contactPhone}
							</p>
							<p>
								<strong>Address:</strong> {order.address}
							</p>
						</div>

						{/* Order Summary */}
						<div className='pb-4 mb-6 border-b'>
							<h3 className='mb-2 text-xl font-semibold'>Order Summary</h3>
							<p>
								<strong>Discount:</strong> 0.00 VND
							</p>
							<p>
								<strong>Shipping Fee:</strong> Free
							</p>
							<p>
								<strong>Delivery Method:</strong> {order.deliveryMethod}
							</p>
							<p>
								<strong>Branch:</strong> {order.branchId}
							</p>
							<p>
								<strong>Payment Method:</strong> {order.paymentMethod}
							</p>
						</div>

						{/* Additional Details */}
						<div className='mb-6'>
							<h3 className='mb-2 text-xl font-semibold'>Additional Information</h3>
							<p>
								<strong>Order Note:</strong> {order.note}
							</p>
							<p>
								<strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
							</p>
							
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default OrderDetail;
