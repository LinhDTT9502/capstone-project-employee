// src/components/OrderDetail.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import HeaderStaff from "../../layouts/HeaderStaff";
import SidebarStaff from "../../layouts/SidebarStaff";
import {
  Button,
  Option,
  Select,
  Step,
  Stepper,
} from "@material-tailwind/react";
import { approveOrder, rejectOrder } from "../../services/Staff/OrderService";
import {
  approveRental,
  rejectRental,
} from "../../services/Staff/RentalService";
import {
  faCheckCircle,
  faClock,
  faCogs,
  faEdit,
  faFlagCheckered,
  faMoneyBillWave,
  faSave,
  faTruck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ORDER_STEPS = [
  { id: 1, label: "Chờ xử lý" },
  { id: 2, label: "Đã xác nhận" },
  { id: 3, label: "Đã thanh toán" },
  { id: 4, label: "Đang xử lý" },
  { id: 5, label: "Đã giao hàng" },
  { id: 6, label: "Hoàn thành" },
];

const RentalDetail = () => {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);
  const [reload, setReload] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const token = localStorage.getItem("token");
  const [editingSection, setEditingSection] = useState(null);

  const [newStatus, setNewStatus] = useState(null); // State for selected status
  const [updating, setUpdating] = useState(false);
  const isStaffOrAdmin =
    user && (user.role === "Order Coordinator" || user.role === "Admin");
  const statusOptions = [
    { label: "Đã hủy đơn", value: 0, color: "bg-red-100 text-red-800" }, // CANCELED
    { label: "Chờ xử lý", value: 1, color: "bg-yellow-100 text-yellow-800" }, // PENDING
    { label: "Đã xác nhận đơn", value: 2, color: "bg-blue-100 text-blue-800" }, // CONFIRMED
    { label: "Đang xử lý", value: 3, color: "bg-green-100 text-green-800" }, // PROCESSING
    { label: "Đã giao hàng", value: 4, color: "bg-purple-100 text-purple-800" }, // SHIPPED
    { label: "Đã giao hàng", value: 5, color: "bg-indigo-100 text-indigo-800" }, // DELIVERED
    { label: "Bị từ chối", value: 6, color: "bg-red-200 text-red-700" }, // DECLINED
    {
      label: "Chờ khách nhận hàng",
      value: 7,
      color: "bg-yellow-200 text-yellow-700",
    }, // AWAITING_PICKUP
    { label: "Đang thuê", value: 8, color: "bg-blue-200 text-blue-700" }, // RENTED
    {
      label: "Yêu cầu gia hạn",
      value: 9,
      color: "bg-orange-200 text-orange-700",
    }, // EXTENSION_REQUESTED
    { label: "Bị trì hoãn", value: 10, color: "bg-orange-100 text-orange-800" }, // DELAYED
    {
      label: "Yêu cầu trả sản phẩm",
      value: 11,
      color: "bg-gray-100 text-gray-800",
    }, // RETURN_REQUESTED
    {
      label: "Đã trả sản phẩm",
      value: 12,
      color: "bg-green-100 text-green-800",
    }, // RETURNED
    {
      label: "Đang kiểm tra sản phẩm trả",
      value: 13,
      color: "bg-blue-100 text-blue-700",
    }, // INSPECTING
    {
      label: "Đơn thuê đã kết thúc",
      value: 14,
      color: "bg-gray-200 text-gray-700",
    }, // COMPLETED
    {
      label: "Xử lý đơn thất bại",
      value: 15,
      color: "bg-red-300 text-red-700",
    }, // FAILED
  ];

  const getCurrentStepIndex = (orderStatus) => {
    const step = ORDER_STEPS.find((step) => step.label === orderStatus);
    return step ? step.id - 1 : 0; // Return 0 if not found (safe default)
  };
  const fetchOrderDetail = async () => {
    try {
      const response = await axios.get(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/get-rental-order-detail?orderId=${rentalId}`
      );
      console.log(response);

      if (response.data.isSuccess) {
        setOrder(response.data.data);
      } else {
        setError("Failed to retrieve order details");
      }
    } catch (error) {
      setError("Error fetching order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [rentalId, reload]);

  // Only destructure if `order` is not null or undefined
  if (!order) {
    return <div>Loading...</div>;
  }

  const {
    id,
    fullName,
    email,
    contactPhone,
    address,
    rentalOrderCode,
    childOrders,
    isExtended,
    productName,
    rentPrice,
    rentalStartDate,
    rentalEndDate,
    totalAmount,
    orderStatus,
    paymentStatus,
    subTotal,
  } = order;

  const children = childOrders?.$values || [];

  const handleStatusChange = async () => {
    if (newStatus === null || updating) return;

    setUpdating(true);
    try {
      const response = await axios.put(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/update-rental-order-status?orderId=${rentalId}&status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.isSuccess) {
        setOrder({ ...order, orderStatus: newStatus }); // Update order status locally
        alert("Order status updated successfully");
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      alert("Error updating order status");
    } finally {
      setUpdating(false);
    }
  };

  const handleApprove = async () => {
    const response = await approveRental(rentalId);
    setReload((prev) => !prev);
    setIsApproved(true);
  };

  const handleReject = async () => {
    const response = await rejectRental(rentalId);
    setReload((prev) => !prev);
    navigate(-1);
    // console.log(response);
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải...</p>
      </div>
    );
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="flex flex-col h-full md:flex-row">
        <div className="flex-grow p-4 md:p-8">
          <div className="container p-6 mx-auto bg-white shadow-lg rounded-xl">
            {/* Header with Order ID and Status */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Chi tiết đơn thuê #{order.rentalOrderCode}
                </h2>

                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      statusOptions.find(
                        (status) => status.label === order.orderStatus
                      )?.color || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                  {isApproved && (
                    <>
                      <select
                        onChange={(e) => setNewStatus(e.target.value)}
                        value={newStatus || order.orderStatus}
                        className="w-36 px-2 py-1 border rounded"
                      >
                        <option>{order.orderStatus}</option>
                        {statusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>

                      <Button
                        onClick={handleStatusChange}
                        disabled={updating}
                        color="blue"
                      >
                        {updating ? "Đang cập nhật..." : "Cập nhật"}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Order Progress */}
            <div className="mb-12">
              <Stepper
                activeStep={getCurrentStepIndex(order.orderStatus)}
                className=" p-4 rounded-lg"
              >
                {ORDER_STEPS.map((status, index) => (
                  <Step
                    key={index}
                    completed={index < getCurrentStepIndex(order.orderStatus)}
                    className={`${
                      index < getCurrentStepIndex(order.orderStatus)
                        ? "bg-blue-500 text-green-600"
                        : "bg-green-600 text-green-600"
                    }`}
                  >
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${
                          index <= getCurrentStepIndex(order.orderStatus)
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        <FontAwesomeIcon
                          icon={
                            index === 0
                              ? faClock
                              : index === 1
                              ? faCheckCircle
                              : index === 2
                              ? faMoneyBillWave
                              : index === 3
                              ? faCogs
                              : index === 4
                              ? faTruck
                              : faFlagCheckered
                          }
                          className="text-lg"
                        />
                      </div>
                      <div
                        className={`absolute top-12 text-xs font-medium whitespace-nowrap ${
                          index <= getCurrentStepIndex(order.orderStatus)
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {status.label}
                      </div>
                    </div>
                  </Step>
                ))}
              </Stepper>
            </div>

            {/* Items Ordered */}
            <div className="mb-8">
              <div className="flex justify-between">
                <h3 className="mb-4 text-xl font-semibold text-gray-800">
                  Sản phẩm đã mua
                </h3>
                {editingSection === "productInformations" ? (
                  <div>
                    <button
                    // onClick={handleCancel}
                    >
                      Hủy
                    </button>
                    <button
                      // onClick={handleSave}
                      className="text-green-500 hover:text-green-700"
                    >
                      <FontAwesomeIcon icon={faSave} /> Lưu
                    </button>
                  </div>
                ) : (
                  <button
                    // onClick={() => handleEditClick("productInformations")}
                    className="text-gray-500 hover:text-black"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="divide-y divide-gray-200">
                  {children.length > 0 ? (
                    children.map((child, index) => (
                      <li
                        key={child.id}
                        className="flex items-center justify-between py-4"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={child.imgAvatarPath}
                            alt={child.productName}
                            className="object-cover w-16 h-16 rounded-lg shadow-sm"
                          />
                          <div>
                            <p className="font-semibold text-gray-700">
                              {child.productName}
                            </p>
                            <p className="flex text-sm text-gray-500 gap-2">
                              Số lượng: {child.quantity}
                              {/* {editingSection === "productInformations" ? (
                            <input
                              type="number"
                              name="quantity"
                              value={
                                formData.saleOrderDetailVMs.$values.find(
                                  (item) => item.productId === item.productId
                                )?.quantity || ""
                              }
                              onChange={(e) =>
                                handleProductChange(e, item.productId)
                              }
                              className="w-1/2 border-orange-500 border-2"
                            />
                          ) : (
                            item.quantity
                          )} */}
                            </p>
                            <p className="text-sm text-gray-500">
                              <b>Màu sắc: </b> {child.color}
                              {/* {editingSection === "productInformations" ? (
                            <input
                              type="text"
                              name="color"
                              value={
                                formData.saleOrderDetailVMs.$values.find(
                                  (item) => item.productId === item.productId
                                )?.color || ""
                              }
                              onChange={(e) =>
                                handleProductChange(e, item.productId)
                              }
                              className="w-1/2 border-orange-500 text-black border-2"
                            />
                          ) : (
                            item.color
                          )} */}
                            </p>
                            <p className="text-sm text-gray-500">
                              <b>Kích thước: </b> {child.size}
                              {/* {editingSection === "productInformations" ? (
                            <input
                              type="text"
                              name="size"
                              value={
                                formData.saleOrderDetailVMs.$values.find(
                                  (item) => item.productId === item.productId
                                )?.size || ""
                              }
                              onChange={(e) =>
                                handleProductChange(e, item.productId)
                              }
                              className="w-1/2 border-orange-500 border-2 text-black"
                            />
                          ) : (
                            item.size
                          )} */}
                            </p>
                            <p className="text-sm text-gray-500">
                              <b>Tình trạng: </b> {child.condition}
                              {/* {editingSection === "productInformations" ? (
                            <input
                              type="number"
                              name="condition"
                              value={
                                formData.saleOrderDetailVMs.$values.find(
                                  (item) => item.productId === item.productId
                                )?.condition || ""
                              }
                              onChange={(e) =>
                                handleProductChange(e, item.productId)
                              }
                              className="w-1/2 border-orange-500 border-2"
                            />
                          ) : (
                            item.condition
                          )} */}
                              %
                            </p>{" "}
                            <p className="mt-2">
                              <span className="font-semibold">
                                Số ngày thuê:
                              </span>{" "}
                              {new Date(
                                child.rentalStartDate
                              ).toLocaleDateString()}{" "}
                              -{" "}
                              {new Date(
                                child.rentalEndDate
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              <span className="font-semibold">Tổng cộng:</span>{" "}
                              <p className="font-medium text-gray-900">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(child.totalAmount)}
                              </p>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(child.rentPrice)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <div className="flex flex-col md:flex-row gap-4">
                        <img
                          src={order.imgAvatarPath || "/placeholder.jpg"}
                          alt={productName}
                          className="w-full md:w-32 h-32 object-cover rounded"
                        />
                        <div className="flex-grow">
                          <h4 className="font-semibold text-lg mb-2">
                            {productName}
                          </h4>
                          <p>
                            <span className="font-semibold">Rent Price:</span>{" "}
                            {rentPrice || "N/A"} ₫
                          </p>
                          <p className="mt-2">
                            <span className="font-semibold">
                              Rental Period:
                            </span>{" "}
                            {new Date(rentalStartDate).toLocaleDateString()} -{" "}
                            {new Date(rentalEndDate).toLocaleDateString()}
                          </p>
                          <p>
                            <span className="font-semibold">Total:</span>{" "}
                            {totalAmount || "N/A"} ₫
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </ul>
              </div>
            </div>
            <div className="flex justify-between py-3 pt-4 mt-2 border-t border-gray-200"></div>

            {/* Order Summary */}
            <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex justify-between py-2">
            <p className="text-gray-600">Tổng phụ</p>
            <p className="font-medium text-gray-900">
            {subTotal.toLocaleString()} ₫</p>
              </div>
              <div className="flex justify-between py-2">
              <p className="text-gray-600">Phí vận chuyển</p>
                <p className="font-semibold text-green-600">Free</p>
              </div>
              <div className="flex justify-between py-2 border-t mt-4 pt-4">
              <p className="text-lg font-semibold text-gray-900">Tổng cộng</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.totalAmount)}
                </p>
              </div>
            </div>
            {order.orderStatus === "Chờ xử lý" &&
              order.deliveryMethod !== "Đến cửa hàng nhận" && (
                <div className="mt-6 flex gap-3 justify-end">
                                <Button
                                  onClick={handleReject}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Từ chối
                                </Button>
                                <Button
                                  onClick={handleApprove}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  Chấp thuận
                                </Button>
                              </div>
              )}
          </div>
        </div>
        <div className="w-full md:w-1/3 p-4">
        <div className="sticky top-4">
        {/* Right Side - Customer Info & Summary */}
         <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
                      {/* edit customerInformation part */}
                      {editingSection === "customerInformation" ? (
                        <div>
                          <button onClick={handleCancel}>Hủy</button>
                          <button
                            onClick={handleSave}
                            className="text-green-500 hover:text-green-700"
                          >
                            <FontAwesomeIcon icon={faSave} /> Lưu
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick("customerInformation")}
                          className="text-gray-500 hover:text-black"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Họ và tên</p>
                        <p className="font-medium">
                          {" "}
                          {editingSection === "customerInformation" ? (
                            <input
                              type="text"
                              name="fullName" // This should match the key in formData
                              value={formData?.fullName || ""}
                              onChange={(e) => handleCustomerInfChange(e)}
                              className="w-full border-orange-500 text-black border-2"
                            />
                          ) : (
                            order.fullName
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">
                          {editingSection === "customerInformation" ? (
                            <input
                              type="text"
                              name="email" // This should match the key in formData
                              value={formData?.email || ""}
                              onChange={(e) => handleCustomerInfChange(e)}
                              className="w-full border-orange-500 text-black border-2"
                            />
                          ) : (
                            order.email
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Số điện thoại</p>
                        <p className="font-medium">
                          {editingSection === "customerInformation" ? (
                            <input
                              type="text"
                              name="contactPhone" // This should match the key in formData
                              value={formData?.contactPhone || ""}
                              onChange={(e) => handleCustomerInfChange(e)}
                              className="w-full border-orange-500 text-black border-2"
                            />
                          ) : (
                            order.contactPhone
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Địa chỉ</p>
                        <p className="font-medium">
                          {editingSection === "customerInformation" ? (
                            <input
                              type="text"
                              name="address" // This should match the key in formData
                              value={formData?.address || ""}
                              onChange={(e) => handleCustomerInfChange(e)}
                              className="w-full border-orange-500 text-black border-2"
                            />
                          ) : (
                            order.address
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
        
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Thông tin khác</h3>
                      {/* edit addition infor */}
                      {editingSection === "additionInfor" ? (
                        <div>
                          <button onClick={handleCancel}>Hủy</button>
                          <button
                            onClick={handleSave}
                            className="text-green-500 hover:text-green-700"
                          >
                            <FontAwesomeIcon icon={faSave} /> Lưu
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick("additionInfor")}
                          className="text-gray-500 hover:text-black"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Phương thức giao hàng</p>
                        <p className="font-medium">
                          {editingSection === "additionInfor" ? (
                            <select
                              name="deliveryMethod" // This should match the key in formData
                              value={formData?.deliveryMethod || ""}
                              onChange={(e) => handleCustomerInfChange(e)}
                              className="w-full border-orange-500 text-black border-2"
                            >
                              <option value="STORE_PICKUP">Đến cửa hàng nhận</option>
                              <option value="HOME_DELIVERY">Giao hàng tận nơi</option>
                            </select>
                          ) : order.deliveryMethod === "STORE_PICKUP" ? (
                            "Đến cửa hàng nhận"
                          ) : order.deliveryMethod === "HOME_DELIVERY" ? (
                            "Giao hàng tận nơi"
                          ) : (
                            order.deliveryMethod
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Chi nhánh</p>
                        <p className="font-medium">{order.branchId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                        <p className="font-medium">
                          {order.paymentMethod || "KH chưa thanh toán"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                        <p className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {order.note && (
                        <div>
                          <p className="text-sm text-gray-500">Ghi chú</p>
                          <p className="font-medium">
                            {editingSection === "additionInfor" ? (
                              <input
                                type="text"
                                name="note" // This should match the key in formData
                                value={formData?.note || ""}
                                onChange={(e) => handleCustomerInfChange(e)}
                                className="w-full border-orange-500 text-black border-2"
                              />
                            ) : (
                              order.note
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
        
        </div>
      </div>
    </>
  );
};

export default RentalDetail;
