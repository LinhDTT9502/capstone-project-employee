import React, { useEffect, useState } from 'react';
import { getOrderbyBranch, getOrderList } from '../../services/Staff/OrderService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getRentalbyBranch, removeRental } from '../../services/Staff/RentalService';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';

const ListRentalbyBranch = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest'); // Sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const ordersPerPage = 30;

  const user = useSelector(selectUser);

  const statusStyles = {
    "Đã hủy": 'bg-red-100 text-red-600',
    "Chờ xử lý": 'bg-yellow-100 text-yellow-600',
    "Đã xác nhận đơn": 'bg-blue-100 text-blue-600',
    "Đã giao hàng": 'bg-green-100 text-green-600',
    "Đang xử lý": 'bg-indigo-100 text-indigo-600',
    "Đã giao cho đơn vị vận chuyển": 'bg-teal-100 text-teal-600',
    "Chờ khách nhận hàng": 'bg-orange-100 text-orange-600',
    "Đang kiểm tra sản phẩm trả": 'bg-gray-100 text-gray-600',
    "Bị trì hoãn": 'bg-orange-100 text-orange-600',
    "Yêu cầu trả sản phẩm": 'bg-purple-100 text-purple-600',
    "Đã trả sản phẩm": 'bg-gray-100 text-gray-600',
    "Yêu cầu gia hạn": 'bg-orange-100 text-orange-600',
    "Đang thuê": 'bg-purple-100 text-purple-600',
    "Đã từ chối": 'bg-red-100 text-red-600',
    "Xử lý đơn thất bại": 'bg-orange-100 text-orange-600',
    "Đơn thuê đã kết thúc": 'bg-purple-100 text-purple-600',
  };

  const paymentStyles = {
    "Đã hủy": 'bg-red-100 text-red-600',
    "Đang chờ thanh toán": 'bg-yellow-100 text-yellow-600',
    "Đã thanh toán": 'bg-blue-100 text-blue-600',
    "Đã giao hàng": 'bg-green-100 text-green-600'
  };
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await getRentalbyBranch(user.BranchId);
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSortChange = (e) => {
    const selectedSortOrder = e.target.value;
    setSortOrder(selectedSortOrder);

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (selectedSortOrder === 'earliest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredOrders(sortedOrders);
  };
  const handleRemoveOrder = async (orderId) => {
    // Confirm before proceeding with removal
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này không?');
    if (!confirmDelete) {
      return; // Exit if user cancels
    }

    try {
      console.log(orderId);

      const data = await removeRental(orderId);
      if (data.isSuccess) {
        alert('Bạn đã xóa đơn hàng thành công!');
        fetchOrders();
      } else {
        console.error('Không thể xóa đơn hàng:', data.message);
      }
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = orders.filter(order =>
      order.rentalOrderCode.toLowerCase().includes(value.toLowerCase()) ||
      order.fullName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải...</p>
      </div>
    );
  }

  if (error) return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng"
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:border-blue-400"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-400 w-full"
            onChange={handleSortChange}
            value={sortOrder}
          >
            <option value="latest">Đơn mới nhất</option>
            <option value="earliest">Đơn cũ nhất</option>
          </select>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-2">
        <span className="text-gray-600 text-xs">
          {Math.min((currentPage - 1) * ordersPerPage + 1, filteredOrders.length)}-
          {Math.min(currentPage * ordersPerPage, filteredOrders.length)} của {filteredOrders.length} đơn hàng
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
            <th className="text-left p-4 font-semibold text-gray-600">Mã đơn hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">Khách hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">Ngày đặt hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">Phương thức nhận hàng</th>
            <th className="text-left p-4 font-semibold text-gray-600">TT thanh toán</th>
            <th className="text-left p-4 font-semibold text-gray-600">TT đơn hàng</th>

            <th className="text-left p-4 font-semibold text-gray-600"></th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders
            .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
            .map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4">{order.rentalOrderCode}</td>
                <td className="p-4">{order.fullName}</td>
                <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4">{order.deliveryMethod}</td>
                <td className="p-4"> <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStyles[order.paymentStatus] || 'bg-gray-100 text-gray-600'
                    }`}
                >
                  {order.paymentStatus}
                </span></td>
                <td className="p-4"> <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.orderStatus] || 'bg-gray-100 text-gray-600'
                    }`}
                >
                  {order.orderStatus}
                </span></td>
                <td className="p-4">
                  <div className='flex items-center gap-3'>
                    {user.ManagerId !== "Unknow" ? (
                      <Link to={`/manager/list-rentals/${order.id}`}>
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                    ) : (
                      <Link to={`/staff/list-rentals/${order.id}`}>
                        <FontAwesomeIcon icon={faEye} />
                      </Link>
                    )}


                    <button
                      onClick={() => handleRemoveOrder(order.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded transition-all duration-300"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListRentalbyBranch;
