import React, { useState } from 'react';
import {
    Card,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import { useLocation } from 'react-router-dom';
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateReturnd } from '../../services/Staff/ReturnService';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { toast } from 'react-toastify';

const ReturnDetail = () => {
    const location = useLocation();
    const { order: initialOrder } = location.state;
    const [order, setOrder] = useState(initialOrder);
    const [showModal, setShowModal] = useState(false);
    const [newStatus, setNewStatus] = useState('Approved');
    const user = useSelector(selectUser);

    const InfoItem = ({ label, value }) => (
        <div>
            <Typography variant="small" className="font-medium text-gray-700">{label}:</Typography>
            <Typography className="mt-1">{value}</Typography>
        </div>
    );

    const statusOptions = [
        { label: "Chấp thuận", value: "Approved", color: "bg-blue-100 text-blue-800" },
        { label: "Từ chối", value: "Rejected", color: "bg-red-100 text-red-800" },
        { label: "Đã hoàn tiền", value: "Refunded", color: "bg-purple-100 text-purple-800" },
        { label: "Hoàn tất", value: "Completed", color: "bg-green-100 text-green-800" },
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleEdit = async () => {
        const payload = {
            ...order,
            processedBy: user.UserId,
            status: newStatus,
            updatedAt: new Date().toISOString(),
        };

        try {
            const response = await updateReturnd(order.returnID, payload);
            if (response.data.isSuccess) {
                toast.success("Cập nhật đơn hàng thành công");
                setOrder((prevOrder) => ({ ...prevOrder, status: newStatus })); // Update local state
                setShowModal(false);
            } else {
                toast.error("Failed to update order");
            }
        } catch (error) {
            toast.error("Error updating order");
        }
    };

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
            <Card className="w-full p-5 mx-auto shadow-lg">
                <div className="flex justify-between">
                    <div className="flex items-center space-x-5">
                        <Typography variant="h4" className="font-bold">Chi tiết yêu cầu hoàn trả</Typography>
                        <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${statusOptions.find((status) => status.value === order.status)?.color || "bg-yellow-100 text-yellow-800"
                                }`}
                        >
                            {statusOptions.find((status) => status.value === order.status)?.label || "Chờ xử lý"}
                        </span>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </button>
                </div>
                <CardBody className="space-y-8">
                    {/* Thông tin chung */}
                    <section>
                        <Typography variant="h5" className="font-semibold mb-4 text-blue-700 border-b pb-2">Thông tin sản phẩm</Typography>
                        <div className="grid grid-cols-2 gap-4">
                            <InfoItem label="Mã sản phẩm" value={order.productCode} />
                            <InfoItem label="Màu sắc" value={order.color} />
                            <InfoItem label="Kích thước" value={order.size} />
                            <InfoItem label="Tình trạng" value={`${order.condition}%`} />
                            <InfoItem label="Tổng tiền cần hoàn trả" value={formatCurrency(order.returnAmount)} />
                        </div>
                    </section>

                    {/* Lý do & Ghi chú */}
                    <section>
                        <Typography variant="h5" className="font-semibold mb-4 text-blue-700 border-b pb-2">Lý do & Ghi chú</Typography>
                        <div className="space-y-4">
                            <div>
                                <Typography variant="small" className="font-medium text-gray-700">Lý do:</Typography>
                                <Typography className="mt-1 p-2 bg-gray-50 rounded">{order.reason}</Typography>
                            </div>
                            <div>
                                <Typography variant="small" className="font-medium text-gray-700">Ghi chú:</Typography>
                                <Typography className="mt-1 p-2 bg-gray-50 rounded">{order.notes || "Không có ghi chú bổ sung"}</Typography>
                            </div>
                        </div>
                    </section>

                    {/* Thông tin đơn hàng chung */}
                    {order.saleOrder && (
                        <section>
                            <Typography variant="h5" className="font-semibold mb-4 text-blue-700 border-b pb-2">Thông tin đơn hàng gốc</Typography>
                            <div className="grid grid-cols-2 gap-4">
                                <InfoItem label="Mã đơn hàng gốc" value={order.saleOrder.saleOrderCode} />
                                <InfoItem label="Họ và tên" value={order.saleOrder.fullName} />
                                <InfoItem label="Địa chỉ" value={order.saleOrder.address} />
                                <InfoItem label="Số điện thoại" value={order.saleOrder.contactPhone} />
                                <InfoItem label="Tổng tiền" value={formatCurrency(order.saleOrder.totalAmount)} />
                            </div>
                        </section>
                    )}

                    {/* Video hoàn trả */}
                    {order.videoUrl && (
                        <section className='w-1/3 h-auto'>
                            <Typography variant="h5" className="font-semibold mb-4 text-blue-700 border-b pb-2">Video sản phẩm khi hoàn trả</Typography>
                            <div className="aspect-w-16 aspect-h-9">
                                <video controls className="w-full h-full rounded-lg object-cover">
                                    <source src={order.videoUrl} type="video/mp4" />
                                    Trình duyệt của bạn không hỗ trợ thẻ video.
                                </video>
                            </div>
                        </section>
                    )}
                </CardBody>
            </Card>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-1/2">
                        <div className='justify-between flex'>


                            <h2 className="text-lg font-semibold pb-2 text-orange-700 ">
                                Cập nhật trạng thái đơn hàng
                            </h2>
                            <select
                                onChange={(e) => setNewStatus(e.target.value)}
                                value={newStatus || order.orderStatus}
                                className="px-3 py-2  border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >

                                {statusOptions.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full border rounded-md p-4 mb-4">
                        <strong>Lí do hủy của khách hàng:</strong>
                            <p className=''>{order.reason}</p>
                            <strong>Ghi chú bổ sung</strong>
                            <p>{order.notes}</p>
                        </div>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                className="bg-gray-500 text-white py-2 px-4 rounded-md"
                                onClick={() => setShowModal(false)}
                            >
                                Đóng
                            </button>
                            <button
                                className="bg-green-500 text-white py-2 px-4 rounded-md"
                                onClick={handleEdit}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReturnDetail;
