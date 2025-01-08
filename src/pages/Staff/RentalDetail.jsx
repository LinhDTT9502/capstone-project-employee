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
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ProductColor } from "../../components/Product/ProductColor";
import { ProductSize } from "../../components/Product/ProductSize";
import TransportFee from "./TransportFee";
import RentalTransportFee from "./RentalTransportFee";

const ORDER_STEPS = [
  { id: 1, label: "Chờ xử lý" },
  { id: 2, label: "Đã xác nhận đơn" },
  { id: 3, label: "Đang xử lý" },
  { id: 4, label: "Đã giao cho ĐVVC" },
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
  const [formData, setFormData] = useState({});

  const [newStatus, setNewStatus] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [transportFees, setTransportFees] = useState({});
  const [transportFee, setTransportFee] = useState(null)
  // Step 1: Extract all fee values
  const feeValues = Object.values(transportFees);

  // Step 2: Calculate the total fee
  const totalFees = feeValues.reduce((acc, fee) => acc + fee, 0);

  const updateTransportFee = async (childId, fee) => {
    setTransportFees((prevFees) => ({
      ...prevFees,
      [childId]: fee,
    }));

    if (totalFees !== order.tranSportFee) {
      // Update formData with the new transport fee and recalculate total
      const updatedTotalAmount = formData.subTotal + totalFees;

      // Update formData
      setFormData((prev) => ({
        ...prev,
        tranSportFee: totalFees,
        totalAmount: updatedTotalAmount,
      }));
      // Check and update paymentStatus based on its current value
      if (formData.paymentStatus === "Đang chờ thanh toán") {
        formData.paymentStatus = 1;
      } else if (formData.paymentStatus === "Đã thanh toán") {
        formData.paymentStatus = 2;
      } else if (formData.paymentStatus === "Đã đặt cọc") {
        formData.paymentStatus = 3;
      } else if (formData.paymentStatus === "Đã hủy") {
        formData.paymentStatus = 4;
      } else if (formData.paymentStatus === "N/A") {
        formData.paymentStatus = 1;
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
        paymentMethodID: formData.paymentMethodId || null,
        deliveryMethod: formData.deliveryMethod,
        paymentStatus: formData.paymentStatus,
        note: formData.note || "",
        parentSubTotal: formData.subTotal,
        parentTranSportFee: totalFees,
        parentTotalAmount: updatedTotalAmount,
        branchId: formData.branchId,
        productInformations: formData.childOrders.$values.map((item) => ({
          cartItemId: null, // You can set this dynamically if available
          productId: item.productId,
          productName: item.productName,
          productCode: item.productCode || "", // Handle null values
          size: item.size || "", // Handle null values
          color: item.color || "", // Handle null values
          condition: item.condition,
          rentPrice: item.rentPrice,
          imgAvatarPath: item.imgAvatarPath,
          quantity: item.quantity,
          rentalDates: {
            dateOfReceipt: item.dateOfReceipt,
            rentalStartDate: item.rentalStartDate,
            rentalEndDate: item.rentalEndDate,
            rentalDays: item.rentalDays
          },
          rentalCosts: {
            subTotal: item.subTotal,
            tranSportFee: transportFees[item.id],
            totalAmount: item.totalAmount + transportFees[item.id]
          },
        })),
      };

      try {
        const response = await axios.put(
          `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/update/?orderId=${rentalId}`,
          payload, // Use the transformed payload
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response) {
          console.log(response);
          setOrder(formData);
          fetchOrderDetail()
        } else {
          console.log("Failed to update order");
        }
      } catch (error) {
        alert("Error updating order");
      }
    }
  };

  const statusOptions = [
    { label: "Đã hủy đơn", value: 0, color: "bg-red-100 text-red-800" }, // CANCELED
    { label: "Chờ xử lý", value: 1, color: "bg-yellow-100 text-yellow-800" }, // PENDING
    { label: "Đã xác nhận đơn", value: 2, color: "bg-blue-100 text-blue-800" }, // CONFIRMED
    { label: "Đang xử lý", value: 3, color: "bg-green-100 text-green-800" }, // PROCESSING
    { label: "Đã giao cho đơn vị vận chuyển", value: 4, color: "bg-purple-100 text-purple-800" }, // SHIPPED
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

      if (response.data.isSuccess) {
        setOrder(response.data.data);
        setFormData(response.data.data)
        console.log(response.data.data);

        if (response.data.data.deliveryMethod === "Đến cửa hàng nhận" || response.data.data.orderStatus !== "Chờ xử lý") {
          setIsApproved(true)
        }
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
    const statusLabel = statusOptions.find(option => option.value === newStatus)?.label;

    setUpdating(true);
    try {
      const response = await axios.put(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/update-rental-order-status/${rentalId}?orderStatus=${newStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.isSuccess) {
        setOrder({ ...order, orderStatus: statusLabel });
        fetchOrderDetail()

      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      alert(error.response.data.message);

    } finally {
      setUpdating(false);
    }
  };
  const updateOrderFee = async (calculatedFee) => {
    if (calculatedFee !== order.tranSportFee) {
      // Update formData with the new transport fee and recalculate total
      const updatedTransportFee = calculatedFee;
      const updatedTotalAmount = formData.subTotal + updatedTransportFee;

      // Update formData
      setFormData((prev) => ({
        ...prev,
        tranSportFee: updatedTransportFee,
        totalAmount: updatedTotalAmount,
      }));
      // Check and update paymentStatus based on its current value
      if (formData.paymentStatus === "Đang chờ thanh toán") {
        formData.paymentStatus = 1;
      } else if (formData.paymentStatus === "Đã thanh toán") {
        formData.paymentStatus = 2;
      } else if (formData.paymentStatus === "Đã đặt cọc") {
        formData.paymentStatus = 3;
      } else if (formData.paymentStatus === "Đã hủy") {
        formData.paymentStatus = 4;
      } else if (formData.paymentStatus === "N/A") {
        formData.paymentStatus = 1;
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
        paymentMethodID: formData.paymentMethodId || null,
        deliveryMethod: formData.deliveryMethod,
        paymentStatus: formData.paymentStatus,
        note: formData.note || "",
        parentSubTotal: formData.subTotal,
        parentTranSportFee: formData.tranSportFee,
        parentTotalAmount: formData.totalAmount,
        branchId: formData.branchId,
        productInformations: formData.childOrders.$values.map((item) => ({
          cartItemId: null, // You can set this dynamically if available
          productId: item.productId,
          productName: item.productName,
          productCode: item.productCode || "", // Handle null values
          size: item.size || "", // Handle null values
          color: item.color || "", // Handle null values
          condition: item.condition,
          rentPrice: item.rentPrice,
          imgAvatarPath: item.imgAvatarPath,
          quantity: item.quantity,
          rentalDates: {
            dateOfReceipt: item.dateOfReceipt,
            rentalStartDate: item.rentalStartDate,
            rentalEndDate: item.rentalEndDate,
            rentalDays: item.rentalDays
          },
          rentalCosts: {
            subTotal: item.subTotal,
            tranSportFee: updatedTransportFee,
            totalAmount: updatedTotalAmount
          },
        })),
      };

      try {
        const response = await axios.put(
          `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/update/?orderId=${rentalId}`,
          payload, // Use the transformed payload
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response) {
          console.log(response);
          setOrder(formData);
          fetchOrderDetail()
        } else {
          console.log("Failed to update order");
        }
      } catch (error) {
        alert("Error updating order");
      }
    }
  };

  const handleApprove = async () => {
    const response = await approveRental(rentalId);
    console.log(response);

    if (response) {
      const statusLabel = statusOptions.find(option => option.value === 2)?.label;
      const response = await axios.put(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/update-rental-order-status/${rentalId}?orderStatus=2`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrder({ ...order, orderStatus: statusLabel });
      fetchOrderDetail()
      setReload((prev) => !prev);
    }

    // setIsApproved(true);
  };

  const handleReject = async () => {
    const response = await rejectRental(rentalId);
    setReload((prev) => !prev);
    navigate(-1);
    // console.log(response);
  };

  const handleEditClick = (section) => {
    setEditingSection(section);
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

  const handleProductChange = (e, productId) => {
    const { name, value } = e.target;
    console.log(name, value);

    // Update formData by finding the product by its ID and modifying the specific field
    setFormData((prev) => {
      const updatedOrderDetailVMs = prev.childOrders.$values.map(
        (product) => {
          if (product.productId === productId) {
            return {
              ...product,
              [name]: value, // Update the specific field for this product
            };
          }
          console.log(product);

          return product; // Keep other products unchanged
        }
      );

      return {
        ...prev,
        childOrders: {
          ...prev.childOrders,
          $values: updatedOrderDetailVMs,
        },
      };
    });
    console.log(formData);
  };
  console.log(formData);

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
    } else if (formData.paymentStatus === "N/A") {
      formData.paymentStatus = 1;
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
      paymentMethodID: formData.paymentMethodId || null,
      deliveryMethod: formData.deliveryMethod,
      paymentStatus: formData.paymentStatus,
      note: formData.note || "",
      parentSubTotal: formData.subTotal,
      parentTranSportFee: formData.tranSportFee,
      parentTotalAmount: formData.totalAmount,
      branchId: formData.branchId,
      productInformations: formData.childOrders.$values.map((item) => ({
        cartItemId: null, // You can set this dynamically if available
        productId: item.productId,
        productName: item.productName,
        productCode: item.productCode || "", // Handle null values
        size: item.size || "", // Handle null values
        color: item.color || "", // Handle null values
        condition: item.condition,
        rentPrice: item.rentPrice,
        imgAvatarPath: item.imgAvatarPath,
        quantity: item.quantity,
        rentalDates: {
          dateOfReceipt: item.dateOfReceipt,
          rentalStartDate: item.rentalStartDate,
          rentalEndDate: item.rentalEndDate,
          rentalDays: item.rentalDays
        },
        rentalCosts: {
          subTotal: item.subTotal,
          tranSportFee: item.tranSportFee || 0,
          totalAmount: item.totalAmount,
        },
      })),
    };
    console.log(payload);


    try {
      const response = await axios.put(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/update/?orderId=${rentalId}`,
        payload, // Use the transformed payload
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response) {
        console.log(response);

        alert("Cập nhật đơn hàng thành công");
        setOrder(formData);
        fetchOrderDetail()
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
                    className={`px-3 py-1 text-sm font-medium rounded-full ${statusOptions.find(
                      (status) => status.label === order.orderStatus
                    )?.color || "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {order.orderStatus}
                  </span>

                </div>              </div>

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
                        className={`absolute top-12 text-xs font-medium text-wrap w-20 text-center ${index <= getCurrentStepIndex(order.orderStatus)
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
                  <div className="flex space-x-1">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-100 transition duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 text-sm font-medium text-green-500 border border-green-500 rounded-lg hover:bg-green-100 transition duration-200 flex items-center"
                    >
                      <FontAwesomeIcon icon={faSave} className="mr-2" />
                      Lưu
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick("productInformations")}
                    className="px-4 py-2 text-sm font-medium text-gray-500 border border-gray-300 rounded-lg hover:text-black hover:bg-gray-100 transition duration-200 flex items-center"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Chỉnh sửa
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
                            </p>
                            <p className="text-sm text-gray-500">
                              <b>Màu sắc: </b>
                              {editingSection === "productInformations" ? (
                                <ProductColor
                                  productCode={child.productCode}
                                  selectedColor={
                                    formData.childOrders.$values.find(
                                      (valueItem) => valueItem.productId === child.productId
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
                                      child.productId
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
                                      child.productId
                                    );
                                  }}
                                />
                              ) : (
                                child.color
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              <b>Kích thước: </b>
                              {editingSection === "productInformations" ? (
                                <ProductSize
                                  productCode={child.productCode}
                                  color={child.color}
                                  selectedSize={formData.childOrders.$values.find(
                                    (valueItem) => valueItem.productId === child.productId
                                  )?.size || ""}
                                  setSelectedSize={(newSize) => {
                                    handleProductChange(
                                      {
                                        target: {
                                          name: "size",
                                          value: newSize
                                        }
                                      },
                                      child.productId
                                    );
                                  }}
                                />
                              ) : (
                                child.size
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              <b>Tình trạng: </b> {child.condition}

                              %
                            </p>{" "}
                            <p className="mt-2">
                              <span className="font-semibold">
                                Ngày thuê:
                              </span>{" "}
                              {new Date(
                                child.rentalStartDate
                              ).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}{" "}
                              -{" "}
                              {new Date(
                                child.rentalEndDate
                              ).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </p>
                            <p>
                              {order.tranSportFee === 0 ? (
                                (child.totalAmount >= 2000000 || order.deliveryMethod === "Đến cửa hàng nhận") ? (
                                  0
                                ) : (
                                 <div>
                                   <TransportFee
                                    address={child.address}
                                    product={order.childOrders.$values}
                                    branchId={order.branchId}
                                    setTransportFee={(fee) => updateTransportFee(child.id, fee)}
                                  />
                                  <span className="font-semibold"> Tổng cộng:</span>{" "}
                                  <p className="font-medium text-gray-900">
                                    {(child.totalAmount + (transportFees[child.id] || 0)).toLocaleString(
                                      "vi-VN"
                                    )}
                                    ₫
                                  </p>
                                  </div>
                                )
                              ) : (
                                <div>
                                  <span className="font-semibold"> Phí vận chuyển:</span>{" "}
                                  <p className="font-medium text-gray-900">
                                    {(child.tranSportFee).toLocaleString(
                                      "vi-VN"
                                    )}
                                    ₫
                                  </p>
                                  <span className="font-semibold"> Tổng cộng:</span>{" "}
                                  <p className="font-medium text-gray-900">
                                    {(child.totalAmount).toLocaleString(
                                      "vi-VN"
                                    )}
                                    ₫
                                  </p>
                                  </div>
                              )}
                              {/* {(order.deliveryMethod === "Đến cửa hàng nhận" || child.totalAmount >= 2000000) ? 0 : <TransportFee
                                address={child.address}
                                product={order.childOrders.$values}
                                branchId={order.branchId}
                                setTransportFee={(fee) => updateTransportFee(child.id, fee)}
                              />}

                              <span className="font-semibold"> Tổng cộng:</span>{" "}
                              <p className="font-medium text-gray-900">
                                {(child.totalAmount + (transportFees[child.id] || 0)).toLocaleString(
                                  "vi-VN"
                                )}
                                ₫
                              </p> */}
                            </p>
                          </div>

                        </div><div className="text-right">
                          <p className="font-medium text-gray-900">
                            {child.rentPrice.toLocaleString('vi-VN')}₫
                          </p>
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
                           {/* <p className="flex text-sm text-gray-500 gap-2">
                              Số lượng: {order.quantity}
                            </p>
                            <p className="text-sm text-gray-500">
                              <b>Màu sắc: </b>
                              {editingSection === "productInformations" ? (
                                <ProductColor
                                  productCode={order.productCode}
                                  selectedColor={
                                    formData.childOrders.$values.find(
                                      (valueItem) => valueItem.productId === child.productId
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
                                      child.productId
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
                                      child.productId
                                    );
                                  }}
                                />
                              ) : (
                                child.color
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              <b>Kích thước: </b>
                              {editingSection === "productInformations" ? (
                                <ProductSize
                                  productCode={child.productCode}
                                  color={child.color}
                                  selectedSize={formData.childOrders.$values.find(
                                    (valueItem) => valueItem.productId === child.productId
                                  )?.size || ""}
                                  setSelectedSize={(newSize) => {
                                    handleProductChange(
                                      {
                                        target: {
                                          name: "size",
                                          value: newSize
                                        }
                                      },
                                      child.productId
                                    );
                                  }}
                                />
                              ) : (
                                child.size
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              <b>Tình trạng: </b> {child.condition}

                              %
                            </p>{" "}
                            <p className="mt-2">
                              <span className="font-semibold">
                                Ngày thuê:
                              </span>{" "}
                              {new Date(
                                child.rentalStartDate
                              ).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}{" "}
                              -{" "}
                              {new Date(
                                child.rentalEndDate
                              ).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </p> */}
                          <p>
                            <span className="font-semibold">Giá thuê:</span>{" "}
                            {rentPrice || "N/A"} ₫
                          </p>
                          <p className="mt-2">
                            <span className="font-semibold">
                              Thời gian thuê:
                            </span>{" "}
                            {new Date(rentalStartDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })} -{" "}
                            {new Date(rentalEndDate).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })}
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
                <p className="text-gray-600">Tạm tính</p>
                <p className="font-medium text-gray-900">
                  {subTotal.toLocaleString()} ₫</p>
              </div>
              <div className="flex justify-between py-2">
                <p className="text-gray-600">Phí vận chuyển</p>
                <p className="font-semibold text-orange-600">
                  
                  {(order.deliveryMethod === "Đến cửa hàng nhận" || order.totalAmount >= 2000000) ? (
                    children.length > 0 ? (
                      totalFees.toLocaleString('vi-VN')
                    ) : 0
                  ) : (
                    childOrders ? ((order.tranSportFee).toLocaleString('vi-VN')) : (<RentalTransportFee
                      address={order.address}
                      product={order}
                      branchId={order.branchId}
                      setTransportFee={setTransportFee}
                    />)

                  )}

                  ₫</p>
              </div>
              <div className="flex justify-between py-2 border-t mt-4 pt-4">
                <p className="text-lg font-semibold text-gray-900">Tổng cộng</p>
                <p className="text-lg font-semibold text-gray-900">
                  {children.length > 0 ? ((order.totalAmount + totalFees).toLocaleString('vi-VN')) : ((totalAmount + transportFee).toLocaleString('vi-VN'))}₫

                </p>
              </div>
            </div>
            {(order.orderStatus === "Chờ xử lý" && order.deliveryMethod === "Giao hàng tận nơi") && (
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
            {order.orderStatus === "Đã xác nhận" &&
            <div className="flex items-center justify-end space-x-4 mt-6 mb-3">
              <select
                onChange={(e) => setNewStatus(e.target.value)}
                value={newStatus || order.orderStatus}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="bg-blue-500 hover:bg-blue-600"

              >
                {updating ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
            }
            
            <div className="bg-white rounded-lg shadow-lg p-6 mb-4">

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Thông tin khách hàng</h3>
                {/* edit customerInformation part */}
                {editingSection === "customerInformation" ? (
                  <div className="flex space-x-1">
                    <button
                      onClick={handleCancel}
                      className="px-2 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-100 transition duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-2 py-2 text-sm font-medium text-green-500 border border-green-500 rounded-lg hover:bg-green-100 transition duration-200 flex items-center"
                    >
                      <FontAwesomeIcon icon={faSave} className="mr-2" />
                      Lưu
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick("customerInformation")}
                    className="px-2 py-2 text-sm font-medium text-gray-500 border border-gray-300 rounded-lg hover:text-black hover:bg-gray-100 transition duration-200 flex items-center"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Chỉnh sửa
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
                  <div className="flex space-x-1">
                    <button
                      onClick={handleCancel}
                      className="px-2 py-2 text-sm font-medium text-red-500 border border-red-500 rounded-lg hover:bg-red-100 transition duration-200"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-2 py-2 text-sm font-medium text-green-500 border border-green-500 rounded-lg hover:bg-green-100 transition duration-200 flex items-center"
                    >
                      <FontAwesomeIcon icon={faSave} className="mr-2" />
                      Lưu
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditClick("additionInfor")}
                    className="px-2 py-2 text-sm font-medium text-gray-500 border border-gray-300 rounded-lg hover:text-black hover:bg-gray-100 transition duration-200 flex items-center"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Chỉnh sửa
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
                  <p className="font-medium">{order.branchName || "KH chọn giao tận nơi"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phương thức thanh toán</p>
                  <p className="font-medium">
                    {order.paymentMethod || "KH chưa thanh toán"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái thanh toán</p>
                  <p className="font-medium">
                    {order.depositStatus || "KH chưa thanh toán"}
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
                      order.note ? order.note : "Không có ghi chú"
                    )}
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default RentalDetail;
