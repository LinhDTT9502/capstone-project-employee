import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { getListOrderRefund } from "../../services/Staff/RefundService";
import { Chip } from "@material-tailwind/react";
import { getOrderbyCode } from "../../services/Staff/OrderService";
import { useNavigate } from "react-router-dom";
import { getRentalDetail } from "../../services/Staff/RentalService";
import RentalRefundModal from "./RentalRefundModal";
import {
    faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UpdateRefundModal from "./UpdateRefundModal";


const ListRefund = () => {
    const user = useSelector(selectUser);
    const [status, setStatus] = useState("");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orderType, setOrderType] = useState(1);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalUpdateOpen, setModalUpdateOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [selectedOrderCode, setSelectedOrderCode] = useState(null);
    const [selectedRenalCode, setSelectedRentalCode] = useState(null);
    const [selectRefundId, setSelectRefundId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getListOrderRefund(orderType, status, user.BranchId);
            console.log(data);

            setOrders(data);
            setError(null);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [reload, status, orderType]);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
    };

    const handleOrderDetail = async (order) => {

        try {
            if (order.saleOrderCode) {
                setSelectedOrderCode(order.saleOrderCode);
                setModalOpen(true);
            } else if (order.rentalOrderCode) {
                setSelectedRentalCode(order.rentalOrderCode)
                setModalOpen(true);

            } else {
                console.warn("No valid order code provided");
            }
        } catch (error) {
            console.error("Error fetching order or rental details:", error);
        }
    };
    const handleUpdateRefund = async (order) => {
        setSelectedOrderCode(order.saleOrderCode);
        setSelectedRentalCode(order.rentalOrderCode)
        setSelectRefundId(order.refundID);
        setModalUpdateOpen(true);
    };
    // const handleOpenModal = (order) => {
    //     setSelectedOrderCode(orderCode);
    //     setModalOpen(true);
    //   };

    const handleCloseModal = () => {
        setReload(prev => !prev);
        setSelectedOrderCode(null);
        setSelectedRentalCode(null)
        setModalOpen(false);
    };

    const handleCloseUpdateModal = () => {
        setReload(prev => !prev);
        setSelectedOrderCode(null);
        setSelectedRentalCode(null)
        setModalUpdateOpen(false);
    };
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Đơn hàng yêu cầu hoàn tiền</h1>

            <div className="flex justify-between mb-4">
                <div className="flex gap-1 p-1 bg-gray-200 rounded-full w-fit transition-all duration-300">
                    <button
                        onClick={() => setOrderType(1)}
                        className={`cursor-pointer w-24 py-2 rounded-full text-center transition-all duration-300 ease-in-out ${orderType === 1
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-transparent text-black hover:bg-gray-300"
                            }`}>
                        Đơn mua
                    </button>
                    <button
                        onClick={() => setOrderType(2)}
                        className={`cursor-pointer w-24 py-2 rounded-full text-center transition-all duration-300 ease-in-out ${orderType === 2
                            ? "bg-blue-500 text-white shadow-md"
                            : "bg-transparent text-black hover:bg-gray-300"
                            }`}>
                        Đơn thuê
                    </button>
                </div>

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
                            className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 ease-in-out ${status === chip.value
                                ? `${chip.color} text-white shadow-md`
                                : "bg-gray-200 text-black hover:bg-gray-300"
                                }`}
                            onClick={() => handleStatusChange(chip.value)}
                        />
                    ))}
                </div>

            </div>



            {/* Table for refund orders */}
            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">Mã đơn hàng</th>
                                <th className="py-2 px-4 border">Lý do</th>
                                <th className="py-2 px-4 border">Trạng thái</th>
                                <th className="py-2 px-4 border">Ngày tạo</th>
                                <th className="py-2 px-4 border"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.refundID} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border">{order.refundID}</td>
                                        <td
                                            className="py-2 px-4 border"
                                        >
                                            <button
                                                className="text-blue-500"
                                                onClick={() => handleOrderDetail(order)}>
                                                {order.saleOrderCode || order.rentalOrderCode || "N/A"}
                                            </button>
                                        </td>
                                        <td className="py-2 px-4 border">{order.reason}</td>
                                        <td className="py-2 px-4 border text-center">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : order.status === "Approved"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="p-2 border flex space-x-4 justify-center">
                                            <button
                                                onClick={() => handleUpdateRefund(order)}
                                                className="bg-green-500 text-white p-2 rounded">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        Không có đơn hàng nào được tìm thấy.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {modalOpen && (
                <RentalRefundModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    orderCode={selectedOrderCode}
                    rentalCode={selectedRenalCode}
                />
            )}

            {modalUpdateOpen && (
                <UpdateRefundModal
                    open={modalUpdateOpen}
                    onClose={handleCloseUpdateModal}
                    orderCode={selectedOrderCode}
                    rentalCode={selectedRenalCode}
                    id={selectRefundId}
                />
            )}
        </div>
    );
};

export default ListRefund;
