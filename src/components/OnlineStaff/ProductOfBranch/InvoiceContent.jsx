import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBuilding, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { getOrderbyCode } from "../../../services/Staff/OrderService";
import { getRentalDetail } from "../../../services/Staff/RentalService";
import { fetchBranchDetail } from "../../../services/branchService";

export default function InvoiceContent({ searchQuery, orderType }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [branch, setBranch] = useState("");

  const fetchOrderDetail = async () => {
    try {
      const response = await getOrderbyCode(searchQuery);
      setOrderDetails(response);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRentalDetail = async () => {
    try {
      const response = await getRentalDetail(searchQuery);
      setOrderDetails(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBranch = async () => {
    if (orderDetails?.branchId) {
      const fetchedBranch = await fetchBranchDetail(orderDetails.branchId);
      setBranch(fetchedBranch || "");
    }
  };

  useEffect(() => {
    if (orderType === "saleOrder") {
      fetchOrderDetail();
    } else if (orderType === "rentOrder") {
      fetchRentalDetail();
    }
  }, [orderType, searchQuery]);

  useEffect(() => {
    fetchBranch();
  }, [orderDetails]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  // Common fields
  const {
    createdAt,
    fullName,
    childOrders,
    address,
    contactPhone,
    email,
    subTotal,
    tranSportFee,
    totalAmount,
    orderImage,
    deliveryMethod,
    orderStatus,
  } = orderDetails;
  const children = childOrders?.$values || [];


  // Items for Sale Order vs Rental Order
  const items = orderType === "saleOrder"
    ? orderDetails?.saleOrderDetailVMs?.$values || []
    : [
      {
        productName: orderDetails?.productName,
        color: orderDetails?.color,
        size: orderDetails?.size,
        quantity: orderDetails?.quantity,
        unitPrice: orderDetails?.rentPrice,
      },
    ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-[210mm] mx-auto min-h-[297mm] print:shadow-none print:min-h-0">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2 text-blue-500" />
            Hóa đơn thanh toán
          </h2>
          <p className="text-sm text-gray-600">
            Mã đơn hàng #: {orderType === "saleOrder" ? orderDetails.saleOrderCode : orderDetails.rentalOrderCode}
          </p>
          <p className="text-sm text-gray-600">Ngày đặt hàng: {new Date(createdAt).toLocaleDateString()}</p>
        </div>
        <div className="w-1/3 text-right justify-end">
          <p className="text-sm text-gray-600 mt-2">{branch.branchName}</p>
          <p className="text-sm text-gray-600">{branch.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
            From:
          </h3>
          <p className="text-gray-600">{fullName}</p>
          <p className="text-gray-600">{address}</p>
          <p className="text-gray-600">Số điện thoại: {contactPhone}</p>
          <p className="text-gray-600">Email: {email}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">
            <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-500" />
          </h3>
          <p className="text-gray-600">{deliveryMethod}</p>
          <p className="text-gray-600">Order Status: {orderStatus}</p>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left py-2 px-4 font-semibold text-gray-700">Sản phẩm</th>
            <th className="text-left py-2 px-4 font-semibold text-gray-700">Loại hàng</th>
            <th className="text-right py-2 px-4 font-semibold text-gray-700">Số lượng</th>
            <th className="text-right py-2 px-4 font-semibold text-gray-700">Đơn giá</th>
          </tr>
        </thead>
        <tbody>
          {children.length > 0 ? (
            children.map((child, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{child.productName}</td>
                <td className="py-2 px-4 border-b">{child.color || "N/A"}, {child.size || "N/A"}</td>
                <td className="py-2 px-4 border-b text-right">{child.quantity}</td>
                <td className="py-2 px-4 border-b text-right">{child.rentPrice.toLocaleString('vi-VN')} ₫</td>
              </tr>
            ))) : (
            items.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{item.productName}</td>
                <td className="py-2 px-4 border-b">{item.color || "N/A"}, {item.size || "N/A"}</td>
                <td className="py-2 px-4 border-b text-right">{item.quantity}</td>
                <td className="py-2 px-4 border-b text-right">{item.unitPrice.toLocaleString('vi-VN')} ₫</td>
              </tr>
            ))
          )}

        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="text-right w-64">
          <div className="flex justify-between text-xl font-bold border-t border-gray-300 pt-2">
            <span>Tổng tiền:</span>
            <span>{totalAmount.toLocaleString('vi-VN')} ₫</span>
          </div>
        </div>
      </div>
    </div>
  );
}
