import React, { useEffect, useState } from "react";
import { Chip, Typography } from "@material-tailwind/react";
import { approveExtension, fetchListExtension } from "../../services/Staff/RentalService";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";

const ListExtension = () => {
    const [extensionRequests, setExtensionRequests] = useState([]);
    const [extensionStatus, setExtensionStatus] = useState(1);
    const user = useSelector(selectUser)
    const [reload, setReload] = useState(false);

    // Chip filter options
    const statusChips = [
        { label: "Pending", value: 1, color: "yellow" },
        { label: "Approve", value: 2, color: "green" },
        { label: "Cancel", value: 3, color: "red" },
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

    return (
        <div className="p-6 space-y-4">
            {/* Title */}
            <Typography variant="h4" className="text-center font-bold">
                Extension Order Requests
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Order Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Extension Days</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Rent Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {extensionRequests && extensionRequests.length > 0 ? (
                            extensionRequests.map((request, index) => (
                                <tr key={request.id} className="hover:bg-gray-100">
                                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.rentalOrderCode}</td>
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
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.extensionDays}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.rentPrice.toLocaleString()} VND</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{request.extensionStatus}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={(e) => handleApprove(request.rentalOrderCode)}
                                                className="bg-green-500 text-white p-2 rounded">approve</button>
                                            <button className="bg-red-500 text-white p-2 rounded">reject</button>
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
            </div>
        </div>
    );
};

export default ListExtension;
