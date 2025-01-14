import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileInvoice, faPrint } from "@fortawesome/free-solid-svg-icons";
import InvoiceContent from "../../components/OnlineStaff/ProductOfBranch/InvoiceContent";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export default function Invoice() {
const location = useLocation();
  const { searchQuery, orderType } = location.state || {};


  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Hóa đơn khách hàng</h1>
          <button
            onClick={handlePrint}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center"
          >
            <FontAwesomeIcon icon={faPrint} className="mr-2" />
            In hóa đơn
          </button>
      </div>

          <div className="mt-6 border-t pt-6 print:border-t-0 print:pt-0 print-only">
            <InvoiceContent searchQuery={searchQuery} orderType={orderType} />
          </div>


    </div>
  );
}
