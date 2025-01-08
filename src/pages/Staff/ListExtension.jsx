import React, { useEffect, useState } from "react";
import { Chip, Typography } from "@material-tailwind/react";
import { approveExtension, fetchListExtension, rejectExtension } from "../../services/Staff/RentalService";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";

const ListExtension = () => {
    const [extensionRequests, setExtensionRequests] = useState([]);
    const [extensionStatus, setExtensionStatus] = useState(1);
    const user = useSelector(selectUser)
    const [reload, setReload] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const [rentalOrderCode, setRentalOrderCode] = useState(null)
    const [reasonText, setReasonText] = useState('');

    // Chip filter options
    const statusChips = [
        { label: "Đang xử lý", value: 1, color: "yellow" },
        { label: "Chấp thuận", value: 2, color: "green" },
        { label: "Từ chối", value: 3, color: "red" },
    ];

    // Fetch extension requests
    const fetchOrders = async () => {
        try {
            const data = await fetchListExtension(extensionStatus, user.BranchId);
            console.log(data);
            if (data.data === null) {
                setExtensionRequests(null);
            } else {
                setExtensionRequests(data.data.$values);
            }

        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [extensionStatus, reload]);

    const handleApprove = async (rentalOrderCode) => {
        const response = await approveExtension(rentalOrderCode);
        setReload((prev) => !prev);
    };

    const handleReject = async () => {
        const response = await rejectExtension(rentalOrderCode, reasonText);
        console.log(response);
        setShowModal(false)
        setReload((prev) => !prev);
    };

    return (
        <div className="p-6 space-y-4">
            {/* Title */}
            <Typography variant="h4" className="font-bold">
                Yêu cầu gia hạn
            </Typography>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-4">
                {statusChips.map((chip) => (
                    <Chip
                        key={chip.value}
                        value={chip.label}
                        variant={extensionStatus === chip.value ? "filled" : "outlined"}
                        color={extensionStatus === chip.value ? chip.color : "gray"}
                        onClick={() => setExtensionStatus(chip.value)}
                        className="cursor-pointer"
                    />
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-500">
                        <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Mã đơn hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Sản phẩm</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ngày gia hạn</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Giá thuê</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {extensionRequests && extensionRequests.length > 0 ? (
                            extensionRequests.map((request, index) => (
                                <tr key={request.id} className="hover:bg-gray-100">
                                    <td className="px-3 py-4 text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-4  py-4 text-sm text-gray-900">{request.rentalOrderCode}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {request.fullName}
                                        <br />
                                        <span className="text-xs text-gray-500">{request.email}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={request.imgAvatarPath}
                                                alt={request.productName}
                                                className="h-12 w-12 rounded-full object-cover"
                                            />
                                            <div>
                                                {request.productName}
                                                <br />
                                                <span className="text-xs text-gray-500">Code: {request.productCode}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900">{request.extensionDays}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.rentPrice.toLocaleString()} VND</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.extensionStatus}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={(e) => handleApprove(request.rentalOrderCode)}
                                                className="bg-green-500 text-white p-2 rounded">Chấp nhận</button>
                                            <button
                                                onClick={() => {
                                                    setRentalOrderCode(request.rentalOrderCode);
                                                    setShowModal(true);
                                                }}
                                                className="bg-red-500 text-white p-2 rounded">Từ chối</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    Không có đơn hàng nào được tìm thấy.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-md shadow-lg w-1/2">
                            <h2 className="text-lg font-semibold pb-2 text-red-700">
                            Vui lòng nhập lí do từ chối:
                            </h2>
                            <div className="w-full border rounded-md p-4 mb-4">
                            
                                <textarea
                                    type="text"
                                    name="cancelReason"
                                    value={reasonText}
                                    className="w-full"
                                    onChange={(e) => setReasonText(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    className="bg-gray-500 text-white py-2 px-4 rounded-md"
                                    onClick={() => setShowModal(false)}
                                >
                                    Đóng
                                </button>
                                <button
                                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700"
                                    onClick={handleReject}
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListExtension;
