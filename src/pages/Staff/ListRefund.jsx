import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { getListOrderRefund } from "../../services/Staff/RefundService";
import { Chip, Typography, Spinner, Button } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import RentalRefundModal from "./RentalRefundModal";
import UpdateRefundModal from "./UpdateRefundModal";

const ListRefund = () => {
  const user = useSelector(selectUser);
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [selectedOrderCode, setSelectedOrderCode] = useState(null);
  const [selectedRentalCode, setSelectedRentalCode] = useState(null);
  const [selectRefundId, setSelectRefundId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch refund orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getListOrderRefund(orderType, status, user.BranchId);
      const reversedOrders = data.slice().reverse();
      setOrders(reversedOrders);
      setFilteredOrders(reversedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [reload, status, orderType]);

  // Filter by search term
  useEffect(() => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = orders.filter(
      (order) =>
        order.saleOrderCode?.toLowerCase().includes(lowerCaseTerm) ||
        order.rentalOrderCode?.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  }, [searchTerm, orders]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const handleOrderDetail = (order) => {
    if (order.saleOrderCode) {
      setSelectedOrderCode(order.saleOrderCode);
    } else if (order.rentalOrderCode) {
      setSelectedRentalCode(order.rentalOrderCode);
    }
    setModalOpen(true);
  };

  const handleUpdateRefund = (order) => {
    setSelectedOrderCode(order.saleOrderCode);
    setSelectedRentalCode(order.rentalOrderCode);
    setSelectRefundId(order.refundID);
    setModalUpdateOpen(true);
  };

  const handleCloseModal = () => {
    setReload((prev) => !prev);
    setSelectedOrderCode(null);
    setSelectedRentalCode(null);
    setModalOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setReload((prev) => !prev);
    setSelectedOrderCode(null);
    setSelectedRentalCode(null);
    setModalUpdateOpen(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <div className="shadow-lg bg-white p-6 rounded-lg">
        {/* Title */}
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold text-blue-gray-800">
            Yêu cầu <span className="text-orange-500">Hoàn tiền</span> ({filteredOrders.length})
          </Typography>
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn hàng..."
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Order Type Tabs */}
        <div className="flex justify-between mb-4">
          <div className="flex gap-1 p-1 bg-gray-200 rounded-full w-fit transition-all duration-300">
            <button
              onClick={() => setOrderType(1)}
              className={`cursor-pointer w-24 py-2 rounded-full text-center transition-all duration-300 ease-in-out ${
                orderType === 1
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-transparent text-black hover:bg-gray-300"
              }`}
            >
              Đơn mua
            </button>
            <button
              onClick={() => setOrderType(2)}
              className={`cursor-pointer w-24 py-2 rounded-full text-center transition-all duration-300 ease-in-out ${
                orderType === 2
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-transparent text-black hover:bg-gray-300"
              }`}
            >
              Đơn thuê
            </button>
          </div>

          {/* Status Chips */}
          <div className="flex gap-2">
            {[
              { label: "Tất cả", value: "", color: "bg-blue-500" },
              { label: "Chờ xử lý", value: "Pending", color: "bg-yellow-400" },
              { label: "Đã chấp thuận", value: "Approved", color: "bg-green-500" },
              { label: "Bị từ chối", value: "Rejected", color: "bg-red-500" },
              { label: "Đã hoàn tiền", value: "Processed", color: "bg-purple-500" },
              { label: "Thất bại", value: "Failed", color: "bg-red-500" },
              { label: "Hoàn tất", value: "Completed", color: "bg-blue-500" },
            ].map((chip) => (
              <Chip
                key={chip.label}
                value={chip.label}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${
                  status === chip.value
                    ? `${chip.color} text-white shadow-md`
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
                onClick={() => handleStatusChange(chip.value)}
              />
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center p-6">
            <Spinner className="h-10 w-10" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">ID</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Mã đơn hàng</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Lý do</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Trạng thái</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Ngày tạo</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order, index) => (
                  <tr key={order.refundID} className="hover:bg-gray-50">
                    <td className="p-4 border-b text-sm text-gray-700">{index + 1}</td>
                    <td className="p-4 border-b text-sm text-gray-700">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleOrderDetail(order)}
                      >
                        {order.saleOrderCode || order.rentalOrderCode || "N/A"}
                      </button>
                    </td>
                    <td className="p-4 border-b text-sm text-gray-700">{order.reason}</td>
                    <td className="p-4 border-b text-sm text-gray-700">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : order.status === "Approved"
                            ? "bg-green-100 text-green-600"
                            : order.status === "Rejected"
                            ? "bg-red-100 text-red-600"
                            : order.status === "Processed"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 border-b text-sm text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="p-4 border-b text-sm">
                      <Button
                        onClick={() => handleUpdateRefund(order)}
                        className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-6">Không có yêu cầu nào được tìm thấy.</p>
        )}

        {/* Pagination */}
        {filteredOrders.length > itemsPerPage && (
          <div className="flex justify-center mt-4">
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => handlePageChange(number + 1)}
                className={`px-3 py-1 mx-1 border rounded ${
                  currentPage === number + 1 ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        )}

        {/* Modals */}
        {modalOpen && (
          <RentalRefundModal
            open={modalOpen}
            onClose={handleCloseModal}
            orderCode={selectedOrderCode}
            rentalCode={selectedRentalCode}
          />
        )}
        {modalUpdateOpen && (
          <UpdateRefundModal
            open={modalUpdateOpen}
            onClose={handleCloseUpdateModal}
            orderCode={selectedOrderCode}
            rentalCode={selectedRentalCode}
            id={selectRefundId}
          />
        )}
      </div>
    </div>
  );
};

export default ListRefund;
