import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileInvoice, faPrint } from "@fortawesome/free-solid-svg-icons";
import InvoiceContent from "../../components/OnlineStaff/ProductOfBranch/InvoiceContent";

export default function Invoice() {
  const [showInvoice, setShowInvoice] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderType, setOrderType] = useState("");

  const handleButtonClick = () => {
    if (!orderType) {
      alert("Vui lòng chọn 'Đơn mua' hoặc 'Đơn thuê' trước khi tạo hóa đơn!");
      return;
    }
    if (!searchQuery) {
      alert("Vui lòng nhập mã đơn hàng!");
      return;
    }

    setShowInvoice(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Hóa đơn khách hàng</h1>
        {showInvoice && (
          <button
            onClick={handlePrint}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center"
          >
            <FontAwesomeIcon icon={faPrint} className="mr-2" />
            In hóa đơn
          </button>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 print:shadow-none">
        <div className="flex flex-col space-y-4 mb-6 print:hidden">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Nhập mã đơn hàng"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-2 border-gray-300 bg-white h-10 px-5 pr-10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
            <button className="absolute right-0 top-0 mt-3 mr-4">
              <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
            </button>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Loại đơn hàng:</label>
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full border-2 border-gray-300 bg-white h-10 px-3 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">-- Chọn loại đơn hàng --</option>
              <option value="saleOrder">Đơn mua</option>
              <option value="rentOrder">Đơn thuê</option>
            </select>
          </div>

          <button
            onClick={handleButtonClick}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center"
          >
            <FontAwesomeIcon icon={faFileInvoice} className="mr-2" />
            Hóa đơn
          </button>
        </div>

        {showInvoice && (
          <div className="mt-6 border-t pt-6 print:border-t-0 print:pt-0 print-only">
            <InvoiceContent searchQuery={searchQuery} orderType={orderType} />
          </div>
        )}
      </div>
    </div>
  );
}
