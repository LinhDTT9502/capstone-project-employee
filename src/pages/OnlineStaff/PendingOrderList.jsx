import React, { useEffect, useState } from 'react';
import { getOrderbyStatus } from '../../services/Staff/OrderService';
import { Link } from 'react-router-dom';
import OrderDetailModal from './OrderDetailModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const PendingOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [sortOrder, setSortOrder] = useState('earliest');
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 15;

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderbyStatus(1);
        const pendingOrders = data
          .filter(order => order.branchId === null)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(pendingOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [reload]);

  const handleOpenModal = (orderId) => {
    setSelectedOrderId(orderId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setReload(prev => !prev);
    setSelectedOrderId(null);
    setModalOpen(false);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    const sortedOrders = [...orders].sort((a, b) => {
      if (e.target.value === 'earliest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    setOrders(sortedOrders);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * ordersPerPage;
  const indexOfFirstItem = indexOfLastItem - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải...</p>
    </div>
  ); if (error) return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng..."
            className="border border-gray-300 rounded-lg p-2 w-1/2 focus:outline-none focus:border-blue-400"
          />
          <select
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-400"
            onChange={handleSortChange}
            value={sortOrder}
          >
            <option value="earliest">Đơn mới nhất</option>
            <option value="latest">Đơn cũ nhất</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end items-center gap-2">

        <span className="text-gray-600 text-xs">
          {Math.min((currentPage - 1) * ordersPerPage + 1, orders.length)}-
          {Math.min(currentPage * ordersPerPage, orders.length)} của {orders.length} đơn hàng
        </span>

        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-gray-700 hover:text-gray-700 text-xs w-5"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-gray-700 text-xs hover:text-gray-700 w-5"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Orders Table */}
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-600">#</th>
            <th className="text-left p-4 font-semibold text-gray-600">Mã đơn hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">Khách hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">Ngày đặt hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">Trạng thái thanh toán</th>
            <th className="text-left p-4 font-semibold text-gray-600">Trạng thái đơn hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600"></th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order, index) => (
            <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-4">{(currentPage - 1) * ordersPerPage + index + 1}</td>
              <td className="p-4">{order.saleOrderCode}</td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700">{order.fullName}</span>
                  <span className="text-sm text-gray-500">{order.email}</span>
                </div>
              </td>
              <td className="p-4">{new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}</td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${order.paymentStatus === 'Đang chờ thanh toán' ? 'bg-yellow-100 text-yellow-600' :
                    order.paymentStatus === 'Đã thanh toán' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}
                >
                  {order.paymentStatus}
                </span>
              </td>
              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}
                >
                  {order.orderStatus}
                </span>
              </td>
              <td className="p-4 space-x-4 flex">
                <button
                  onClick={() => handleOpenModal(order.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Bàn giao
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={`px-3 py-1 mx-1 border rounded ${currentPage === number + 1 ? "bg-black text-white" : "bg-gray-200"
              }`}
          >
            {number + 1}
          </button>
        ))}
      </div>

      {modalOpen && (
        <OrderDetailModal
          open={modalOpen}
          onClose={handleCloseModal}
          orderId={selectedOrderId}
        />
      )}
    </div>
  );
};

export default PendingOrderList;
