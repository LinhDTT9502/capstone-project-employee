import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { getListOrderRefund } from "../../services/Staff/RefundService";
import { Chip } from "@material-tailwind/react";

const ListRefund = () => {
    const user = useSelector(selectUser);
    const [status, setStatus] = useState("");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getListOrderRefund(status, user.BranchId);
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
    }, [status]);

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Đơn hàng yêu cầu hoàn tiền</h1>

            <div className="flex justify-between mb-4">
                <div className="flex gap-2">
                    <button className=" border-2 border-orange-500 focus:text-white hover:text-white hover:bg-orange-500 focus:bg-orange-500  text-orange-500 font-bold p-2 rounded">
                        Đơn mua
                    </button>
                    <button className="border-2 border-orange-500 focus:text-white hover:text-white hover:bg-orange-500 focus:bg-orange-500  text-orange-500 font-bold p-2 rounded">
                        Đơn thuê
                    </button>
                </div>
                <div className="flex gap-2">
                    {[
                        { label: "Tất cả", value: "" },
                        { label: "Chờ xử lý", value: "Pending" },
                        { label: "Đã chấp thuận", value: "Approved" },
                        { label: "Bị từ chối", value: "Rejected" },
                        { label: "Đã hoàn tiền", value: "Processed" },
                        { label: "Thất bại", value: "Failed" },
                        { label: "Hoàn tất", value: "Completed" },
                    ].map((chip) => (


                        <Chip
                            key={chip.label}
                            value={chip.label}
                            className={`cursor-pointer ${status === chip.value ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
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
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.refundID} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border">{order.refundID}</td>
                                        <td className="py-2 px-4 border">
                                            {order.saleOrderCode || order.rentalOrderCode || "N/A"}
                                        </td>
                                        <td className="py-2 px-4 border">{order.reason}</td>
                                        <td className="py-2 px-4 border text-center">
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === "Pending"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : order.status === "Processed"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-2 px-4 border">
                                            {new Date(order.createdAt).toLocaleDateString()}
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
        </div>
    );
};

export default ListRefund;
