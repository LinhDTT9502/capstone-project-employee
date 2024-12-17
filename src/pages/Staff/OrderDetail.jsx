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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCheckCircle,
  faMoneyBillWave,
  faCogs,
  faTruck,
  faFlagCheckered,
  faArrowLeft,
  faEdit,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { ProductColor } from "../../components/Product/ProductColor";
import { ProductSize } from "../../components/Product/ProductSize";

const ORDER_STEPS = [
  { id: 1, label: "Chờ xử lý" },
  { id: 2, label: "Đã xác nhận" },
  { id: 3, label: "Đang xử lý" },
  { id: 4, label: "Đã vận chuyển" },
  { id: 5, label: "Đã giao hàng" },
  { id: 6, label: "Đã hoàn thành" },
];

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);
  const [reload, setReload] = useState(false);
  const [newStatus, setNewStatus] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({});

  const statusOptions = [
    { label: "Đã hủy", value: 0, color: "bg-red-100 text-red-800" },
    { label: "Chờ xử lý", value: 1, color: "bg-yellow-100 text-yellow-800" },
    { label: "Đã xác nhận", value: 2, color: "bg-blue-100 text-blue-800" },
    { label: "Đang xử lý", value: 3, color: "bg-green-100 text-green-800" },
    {
      label: "Đã vận chuyển",
      value: 4,
      color: "bg-purple-100 text-purple-800",
    },
    { label: "Đã giao hàng", value: 5, color: "bg-indigo-100 text-indigo-800" },
    {
      label: "Đã hoàn thành",
      value: 11,
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const getCurrentStepIndex = (orderStatus) => {
    const step = ORDER_STEPS.find((step) => step.label === orderStatus);
    return step ? step.id - 1 : 0;
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(
          `https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/get-sale-order-detail?orderId=${orderId}`
        );
        if (response.data.isSuccess) {
          setOrder(response.data.data);
          setFormData(response.data.data);
          console.log(response.data.data);

        } else {
          setError("Failed to retrieve order details");
        }
      } catch (error) {
        setError("Error fetching order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
    getCurrentStepIndex();
  }, [reload]);

  const handleStatusChange = async () => {
    if (newStatus === null || updating) return;

    try {
      const response = await axios.put(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/update-order-status?orderId=${orderId}&status=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response) {
        // Update order status locally without needing to reload
        setOrder((prevOrder) => ({ ...prevOrder, orderStatus: newStatus }));
        setUpdating(true);

        alert("Cập nhật trạng thái thành công");
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
    const response = await approveOrder(orderId);
    setReload((prev) => !prev);
    console.log(response);
  };

  const handleReject = async () => {
    const response = await rejectOrder(orderId);
    setReload((prev) => !prev);
    navigate(-1);
  };

  // Handle editing state
  const handleEditClick = (section) => {
    setEditingSection(section);
  };

  // Handle input changes
  const handleProductChange = (e, productId) => {
    const { name, value } = e.target;
    console.log(name, value);

    // Update formData by finding the product by its ID and modifying the specific field
    setFormData((prev) => {
      const updatedOrderDetailVMs = prev.saleOrderDetailVMs.$values.map(
        (product) => {
          if (product.productId === productId) {
            return {
              ...product,
              [name]: value,

            };
          }
          console.log(product);

          return product;
        }
      );

      return {
        ...prev,
        saleOrderDetailVMs: {
          ...prev.saleOrderDetailVMs,
          $values: updatedOrderDetailVMs,
        },
      };
    });
    console.log(formData);
  };

  const handleCustomerInfChange = (e) => {
    const { name, value } = e.target; // Get the name and value of the input
    setFormData((prevData) => ({
      ...prevData, // Spread the existing formData
      [name]: value, // Update only the field being edited
    }));
  };

  const handleCancel = () => {
    setEditingSection(null);
  };

  // Submit updates to the API
  const handleSave = async () => {
    // Check and update paymentStatus based on its current value
    if (formData.paymentStatus === "Đang chờ thanh toán") {
      formData.paymentStatus = 1;
    } else if (formData.paymentStatus === "Đã thanh toán") {
      formData.paymentStatus = 2;
    } else if (formData.paymentStatus === "Đã đặt cọc") {
      formData.paymentStatus = 3;
    } else if (formData.paymentStatus === "Đã hủy") {
      formData.paymentStatus = 4;
    }
    if (formData.deliveryMethod === "Đến cửa hàng nhận") {
      formData.deliveryMethod = "STORE_PICKUP";
    } else if (formData.deliveryMethod === "Giao hàng tận nơi") {
      formData.deliveryMethod = "HOME_DELIVERY";
    }

    // Prepare the payload in the structure the API expects
    const payload = {
      customerInformation: {
        userId: formData.userId, // Assuming `id` is the userId
        email: formData.email,
        fullName: formData.fullName,
        gender: formData.gender,
        contactPhone: formData.contactPhone,
        address: formData.address,
      },
      deliveryMethod: formData.deliveryMethod,
      branchId: formData.branchId,
      dateOfReceipt: formData.dateOfReceipt,
      paymentMethodId: formData.paymentMethodId || null, // Assuming you may have a `paymentMethodId` field
      paymentStatus: formData.paymentStatus,
      note: formData.note || "", // Ensure note is always a string, even if empty
      productInformations: formData.saleOrderDetailVMs.$values.map((item) => ({
        cartItemId: null, // You can set this dynamically if available
        productId: item.productId,
        productName: item.productName,
        productCode: item.productCode || "BAYORA88SS", // Handle null values
        size: item.size || "", // Handle null values
        color: item.color || "", // Handle null values
        condition: item.condition,
        unitPrice: item.unitPrice,
        imgAvatarPath: item.imgAvatarPath,
        quantity: item.quantity,
      })),
      saleCosts: {
        subTotal: formData.subTotal,
        tranSportFee: formData.tranSportFee || 0,
        totalAmount: formData.totalAmount,
      },
    };

    console.log("Prepared Payload:", payload);

    try {
      const response = await axios.put(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/update-sale-order/?orderId=${orderId}`,
        payload, // Use the transformed payload
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.data.isSuccess) {
        alert("Cập nhật đơn hàng thành công");
        setOrder(formData);
        setEditingSection(null); // Exit edit mode
      } else {
        alert("Failed to update order");
      }
    } catch (error) {
      alert("Error updating order");
    }
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
    <div className="flex flex-col h-full md:flex-row">
      <div className="flex-grow p-4 md:p-8">
        <div className="container p-6 mx-auto bg-white shadow-lg rounded-xl">
          {/* Header Section with Order ID and Status */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Chi tiết đơn hàng #{order.saleOrderCode}
              </h2>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${statusOptions.find(
                    (status) => status.label === order.orderStatus
                  )?.color || "bg-gray-100 text-gray-800"
                    }`}
                >
                  {order.orderStatus}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outlined"
                color="blue"
                className="flex items-center gap-2"
                onClick={() => navigate(-1)}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-sm" />
                Quay lại
              </Button>
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
                  className={`${index < getCurrentStepIndex(order.orderStatus)
                    ? "bg-blue-500 text-green-600"
                    : "bg-green-600 text-green-600"
                    }`}
                >
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full ${index <= getCurrentStepIndex(order.orderStatus)
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
                      className={`absolute top-12 text-xs font-medium whitespace-nowrap ${index <= getCurrentStepIndex(order.orderStatus)
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

          {/* Ordered Products */}
          <div className="mb-8">
            <div className="flex justify-between">
              <h3 className="mb-4 text-xl font-semibold text-gray-800">
                Sản phẩm đã mua
              </h3>
              {/* edit productInformations and saleCosts part */}
              {editingSection === "productInformations" ? (
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
                  onClick={() => handleEditClick("productInformations")}
                  className="text-gray-500 hover:text-black"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <ul className="divide-y divide-gray-200">
                {order.saleOrderDetailVMs.$values.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.imgAvatarPath}
                        alt={item.productName}
                        className="object-cover w-16 h-16 rounded-lg shadow-sm"
                      />
                      <div>
                        <p className="font-semibold text-gray-700">
                          {item.productName}
                        </p>
                        <p className="flex text-sm text-gray-500 gap-2">
                          Số lượng:{" "}

                          {item.quantity}

                        </p>
                        <p className="text-sm flex text-gray-500">
                          <b>Màu sắc: </b>
                          {editingSection === "productInformations" ? (
                            <ProductColor
                              productCode={item.productCode}
                              selectedColor={
                                formData.saleOrderDetailVMs.$values.find(
                                  (valueItem) => valueItem.productId === item.productId
                                )?.color || ""
                              }
                              setSelectedColor={(newColor) => {
                                handleProductChange(
                                  {
                                    target: {
                                      name: "color",
                                      value: newColor
                                    }
                                  },
                                  item.productId
                                );
                              }}
                              onColorSelect={(imgAvatarPath) => {
                                handleProductChange(
                                  {
                                    target: {
                                      name: "imgAvatarPath",
                                      value: imgAvatarPath
                                    }
                                  },
                                  item.productId
                                );
                              }}
                            />

                          ) : (
                            item.color
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          <b>Kích thước: </b>
                          {editingSection === "productInformations" ? (

                            <ProductSize
                              productCode={item.productCode}
                              color={item.color}
                              selectedSize={formData.saleOrderDetailVMs.$values.find(
                                (valueItem) => valueItem.productId === item.productId
                              )?.size || ""}
                              setSelectedSize={(newSize) => {
                                handleProductChange(
                                  {
                                    target: {
                                      name: "size",
                                      value: newSize
                                    }
                                  },
                                  item.productId
                                );
                              }}
                            />

                          ) : (
                            item.size
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          <b>Tình trạng: </b>
                          {item.condition}
                          %
                        </p>{" "}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.unitPrice)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-between py-3 pt-4 mt-2 border-t border-gray-200"></div>
          {/* Order Summary */}
          <div className="p-4 rounded-lg bg-gray-50">
            <div className="flex justify-between py-2">
              <p className="text-gray-600">Tạm tính</p>
              <p className="font-medium text-gray-900">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.subTotal)}
              </p>
            </div>
            <div className="flex justify-between py-2">
              <p className="text-gray-600">Phí vận chuyển</p>
              <p className="font-medium text-green-600">Miễn phí</p>
            </div>
            <div className="flex justify-between py-3 pt-4 mt-2 border-t border-gray-200">
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
            order.deliveryMethod !== "Đến cửa hàng nhận" &&
            order.deliveryMethod !== "STORE_PICKUP" && (
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
          <div className="flex items-center justify-end space-x-4 mt-6 mb-3">
            <select
              onChange={(e) => setNewStatus(e.target.value)}
              value={newStatus || order.orderStatus}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Chọn tình trạng đơn</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <Button
              onClick={handleStatusChange}
              disabled={updating}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {updating ? "Đang thay đổi..." : "Cập nhật"}
            </Button>
          </div>
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
                  {new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
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
  );
};

export default OrderDetail;
