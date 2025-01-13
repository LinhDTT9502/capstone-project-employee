import React, { useEffect, useState } from 'react';
import { getOrderbyBranch, getOrderList } from '../../services/Staff/OrderService';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { getRentalbyBranch, getRentalbyStatus, removeRental } from '../../services/Staff/RentalService';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { Button } from '@material-tailwind/react';
import { toast } from 'react-toastify';
import RentalRefundModal from './RentalRefundModal';
import { fetchProductDetail } from '../../services/productService';
import axios from 'axios';

const RentalReturnList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('earliest'); // Sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const ordersPerPage = 30;
  const [status, setStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState(null);
  const [isRestocked, setIsRestocked] = useState(false);
  const [isInspected, setIsInspected] = useState(false);
  const [damagePercent, setDamagePercent] = useState(0);
  const [damageFee, setDamageFee] = useState(0); // State for damage fee
  const user = useSelector(selectUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lateFee, setLateFee] = useState(0);
  const [selectOrder, setSelectOrder] = useState(null);
console.log(selectOrder);


  const statusStyles = {
    "Đã hủy": "bg-red-100 text-red-600",
    "Chờ xử lý": "bg-yellow-100 text-yellow-600",
    "Đã xác nhận": "bg-blue-100 text-blue-600",
    "Đang xử lý": "bg-indigo-100 text-indigo-600",
    "Đã giao cho ĐVVC": "bg-teal-100 text-teal-600",
    "Đã giao hàng": "bg-green-100 text-green-600",
    "Chờ khách nhận hàng": "bg-orange-100 text-orange-600",
    "Đã từ chối": "bg-red-100 text-red-600",
    "Đang thuê": "bg-purple-100 text-purple-600",
    "Đang gia hạn": "bg-indigo-100 text-indigo-600",
    "Bị trì hoãn": "bg-orange-100 text-orange-600",
    "Yêu cầu trả sản phẩm": "bg-purple-100 text-purple-600",
    "Đã trả sản phẩm": "bg-gray-100 text-gray-600",
    "Đang kiểm tra sản phẩm trả": "bg-gray-100 text-gray-600",
    "Đã hoàn thành": "bg-green-100 text-green-600",
    "Xử lý đơn thất bại": "bg-orange-100 text-orange-600",

    // Các trạng thái cọc
    "Đã thanh toán cọc 100% tiền thuê": "bg-green-100 text-green-600",
    "Cọc 50% tiền thuê": "bg-blue-100 text-blue-600",
    "Chưa thanh toán": "bg-red-100 text-red-600",
    "Đã hoàn trả": "bg-gray-100 text-gray-600",
    "Đang chờ thanh toán cọc 100% tiền thuê": "bg-orange-100 text-orange-600",
  };


  const paymentStyles = {
    "Đã hủy": "bg-red-100 text-red-600",
    "Đang chờ thanh toán": "bg-yellow-100 text-yellow-600",
    "Đã thanh toán": "bg-blue-100 text-blue-600",
    "Đã đặt cọc": "bg-teal-100 text-teal-600",
    "Đã hoàn tiền": "bg-orange-100 text-orange-600",
    "Thất bại": "bg-red-100 text-red-600",
  };

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const fetchOrders = async () => {
    try {
      const data = await getRentalbyStatus(11);

      if (data) {
        const pendingOrders = data.$values
          .filter(order => order.branchId == user.BranchId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(pendingOrders);
        setFilteredOrders(pendingOrders);
      } else {
        setOrders([]);
        setFilteredOrders([]);
      }

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

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        (status === "" || order.orderStatus === status) &&
        (order.rentalOrderCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredOrders(filtered);
  }, [status, searchTerm, orders]);

  const calculateLateFee = () => {
    const returnDate = new Date(selectOrder.returnDate);
    const dueDate = new Date(selectOrder.extendedDueDate || selectOrder.rentalEndDate);
    returnDate.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    console.log(returnDate);
    

    if (returnDate <= dueDate) return 0;

    const daysLate = Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24));
    return daysLate * selectOrder.rentPrice;
  };

  const calculateDamageFee = async () => {

    try {
      const productData = await fetchProductDetail(selectOrder.productId);
      return damagePercent <= 5
        ? 0
        : ((damagePercent - 5) / 100) * productData.listedPrice;
    } catch (error) {
      console.error("Error calculating damage fee:", error);
      return 0;
    }
  };

  const handleButtonClick = async (order) => {
    setSelectOrder(order);
    const calculatedLateFee = calculateLateFee(order);
    const calculatedDamageFee = await calculateDamageFee();
    setLateFee(calculatedLateFee);
    setDamageFee(calculatedDamageFee);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectOrder) return;
    setIsSubmitting(true);

    const requestBody = {
      selectedReturnOrderId: selectOrder.id,
      isRestocked,
      isInspected,
      lateFee,
      damageFee,
    };

    try {
      console.log(requestBody);
      
      // await axios.put(
      //   "https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/RentalOrder/return",
      //   requestBody,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${localStorage.getItem("token")}`,
      //     },
      //   }
      // );
      // toast.success("Cập nhật thành công!");
      // fetchOrders();
      // setShowModal(false);
      setIsSubmitting(false);
      resetFields();
    } catch (error) {
      console.error("Error updating return order:", error);
      toast.error("Cập nhật thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFields = () => {
    setSelectOrder(null);
    setDamagePercent(0);
    setLateFee(0);
    setDamageFee(0);
  };


  const handleSortChange = (e) => {
    const selectedSortOrder = e.target.value;
    setSortOrder(selectedSortOrder);

    const sortedOrders = [...filteredOrders].sort((a, b) => {
      if (selectedSortOrder === 'earliest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
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
        toast.success('Bạn đã xóa đơn hàng thành công!');
        fetchOrders();
      } else {
        console.error('Không thể xóa đơn hàng:', data.message);
        toast.error('Không thể xóa đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
    }
  };
  const handleOrderDetail = async (rentalOrderCode) => {
    setSelectedOrderCode(rentalOrderCode);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrderCode(null);
    setModalOpen(false);
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

            <option value="earliest">Đơn mới nhất</option>
            <option value="latest">Đơn cũ nhất</option>
          </select>
        </div>
      </div>

      {/* <div className="flex gap-2 py-3">
        {[
          { label: "Tất cả", value: "", color: "bg-blue-500 text-white" },
          {
            label: "Chờ xử lý",
            value: "Chờ xử lý",
            color: "bg-yellow-100 text-yellow-600",
          },
          {
            label: "Đã xác nhận",
            value: "Đã xác nhận",
            color: "bg-blue-100 text-blue-600",
          },
          {
            label: "Đang xử lý",
            value: "Đang xử lý",
            color: "bg-indigo-100 text-indigo-600",
          },
          {
            label: "Đã giao cho ĐVVC",
            value: "Đã giao cho ĐVVC",
            color: "bg-teal-100 text-teal-600",
          },
          {
            label: "Đã giao hàng",
            value: "Đã giao hàng",
            color: "bg-green-100 text-green-600",
          },

          {
            label: "Đã hoàn thành",
            value: "Đã hoàn thành",
            color: "bg-green-100 text-green-600",
          },
          {
            label: "Đã hủy",
            value: "Đã hủy",
            color: "bg-red-100 text-red-600",
          },
          { label: "Đang gia hạn", value: "Đang gia hạn", color: "bg-indigo-100 text-indigo-600" },
        ].map((chip) => (
          <button
            key={chip.label}
            className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
              status === chip.value
                ? `${chip.color} shadow-md`
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
            onClick={() => handleStatusChange(chip.value)}
          >
            {chip.label}
          </button>
        ))}
      </div> */}

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
      {filteredOrders && filteredOrders.length > 0 ? (
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-600">Mã đơn hàng</th>
              <th className="text-left p-4 font-semibold text-gray-600">Khách hàng</th>
              <th className="text-left p-4 font-semibold text-gray-600">Ngày kết thúc thuê</th>
              <th className="text-left p-4 font-semibold text-gray-600">Ngày gia hạn</th>
              <th className="text-left p-4 font-semibold text-gray-600">Ngày trả hàng</th>
              <th className="text-left p-4 font-semibold text-gray-600">TT đơn hàng</th>

              <th className="text-left p-4 font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders
              .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
              .map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4">
                    <button
                      className="text-blue-500"
                      onClick={() => handleOrderDetail(order.rentalOrderCode)}>
                      {order.rentalOrderCode}
                    </button>
                  </td>
                  <td className="p-4">{order.fullName}</td>
                  <td className="p-4">{new Date(order.rentalEndDate).toLocaleDateString()}</td>
                  <td className="p-4">{order.extendedDueDate ? new Date(order.extendedDueDate).toLocaleDateString() : "N/A"}</td>
                  <td className="p-4">{order.returnDate ? new Date(order.returnDate).toLocaleDateString() : "N/A"}</td>
                  <td className="p-4"> <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.orderStatus] || 'bg-gray-100 text-gray-600'
                      }`}
                  >
                    {order.orderStatus}
                  </span></td>
                  <td className="p-4">
                    <div className='flex items-center gap-3'>

                      <Button
                        size="md"
                        color="blue"
                        variant="text"
                        onClick={() => handleButtonClick(order)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="text-sm" />
                      </Button>
                      <Button
                        onClick={() => handleRemoveOrder(order.id)}
                        size="md"
                        color="red"
                        variant="text"
                        className="flex items-center gap-2 px-2 py-2"                   >
                        <FontAwesomeIcon icon={faTrash} className="text-sm	" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 py-4">Không tìm thấy đơn hàng nào</p>
      )}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Cập nhật trạng thái đơn hàng
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="restocked"
                  checked={isRestocked}
                  onChange={(e) => setIsRestocked(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="restocked" className="text-gray-700">
                  Hàng đã được nhập kho
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inspected"
                  checked={isInspected}
                  onChange={(e) => setIsInspected(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="inspected" className="text-gray-700">
                  Hàng đã được kiểm tra
                </label>
              </div>
              <div className="space-y-2">
                <label htmlFor="lateFee" className="block text-sm font-medium text-gray-700">
                  Phí trễ hạn:
                </label>
                <input
                  type="number"
                  id="lateFee"
                  value={calculateLateFee}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="damagePercent" className="block text-sm font-medium text-gray-700">
                  Phần trăm hao tổn sản phẩm (%):
                </label>
                <input
                  type="number"
                  id="damagePercent"
                  value={damagePercent}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0 && value <= 100) {
                      setDamagePercent(value);
                      calculateDamageFee(value);
                    }
                  }}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="text-sm font-medium text-gray-700">
                Phí hư hại: {damageFee.toLocaleString()} ₫
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
              <button
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
      {modalOpen && (
        <RentalRefundModal
          open={modalOpen}
          onClose={handleCloseModal}
          rentalCode={selectedOrderCode}
        />
      )}

    </div>
  );
};

export default RentalReturnList;