import React, { useEffect, useState } from 'react';
import { getOrderbyBranch, getOrderList } from '../../services/Staff/OrderService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { getRentalbyBranch } from '../../services/Staff/RentalService';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';


const ListRentalbyBranch = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const statusStyles = {
    CANCELLED: 'bg-red-100 text-red-600',
    PENDING: 'bg-yellow-100 text-yellow-600',
    CONFIRMED: 'bg-blue-100 text-blue-600',
    PAID: 'bg-green-100 text-green-600',
    PROCESSING: 'bg-indigo-100 text-indigo-600',
    SHIPPED: 'bg-teal-100 text-teal-600',
    DELAYED: 'bg-orange-100 text-orange-600',
    COMPLETED: 'bg-purple-100 text-purple-600',
    REFUNDED: 'bg-gray-100 text-gray-600',
  };
  const user = useSelector(selectUser)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getRentalbyBranch(user.BranchId);
        setOrders(data);
        console.log(data);
        
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center py-4">Loading...</p>;
  if (error) return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Search and Filters */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search for order"
          className="border border-gray-300 rounded-lg p-2 w-1/3 focus:outline-none focus:border-blue-400"
        />
        <div className="flex gap-4">
          <select className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-400">
            <option value="">Filter by status</option>
            {/* Add more status options here */}
          </select>
          <select className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-400">
            <option value="">All Categories</option>
            {/* Add more category options here */}
          </select>
          <select className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-400">
            <option value="">All Customers</option>
            {/* Add more customer options here */}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-600">Mã đơn hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">Khách hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">Ngày đặt hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">Phương thức nhận hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">Trạng thái thanh toán</th>
            <th className="text-left p-4 font-semibold text-gray-600">Trạng thái đơn hàng</th>

            <th className="text-left p-4 font-semibold text-gray-600"></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (

            <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-4">{order.saleOrderCode}</td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">{order.fullName}</span>
                  <span className="text-sm text-gray-500">{order.email}</span>
                </div>
              </td>
              <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="p-4">{order.deliveryMethod}</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${order.paymentStatus === 'IsCanceled' ? 'bg-red-100 text-red-600' :
                      order.paymentStatus === 'IsPaid' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                    }`}
                >
                  {order.paymentStatus}
                </span>
              </td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.orderStatus] || 'bg-gray-100 text-gray-600'
                    }`}
                >
                  {order.orderStatus}
                </span>
              </td>

              <td className="p-4">
                <Link to={`/admin/orders/${order.id}`} ><FontAwesomeIcon icon={faEye} /></Link>
              </td>
            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListRentalbyBranch;
