import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBuilding, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";

export default function InvoiceContent() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-[210mm] mx-auto min-h-[297mm] print:shadow-none print:min-h-0">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            <FontAwesomeIcon icon={faFileInvoiceDollar} className="mr-2 text-blue-500" />
            Invoice
          </h2>
          <p className="text-sm text-gray-600">Invoice #: INV-001</p>
          <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <img src="/your-logo.png" alt="Company Logo" className="w-32 h-auto" />
          <p className="text-sm text-gray-600 mt-2">Your Company Name</p>
          <p className="text-sm text-gray-600">123 Business Street, City, Country</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">
            <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-500" />
            From:
          </h3>
          <p className="text-gray-600">Your Name</p>
          <p className="text-gray-600">362 Bonnet Ave</p>
          <p className="text-gray-600">Austin, TX 78742</p>
          <p className="text-gray-600">Phone: (123) 456-7890</p>
          <p className="text-gray-600">Email: your.email@example.com</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">
            <FontAwesomeIcon icon={faBuilding} className="mr-2 text-blue-500" />
            To:
          </h3>
          <p className="text-gray-600">Robert Pearson</p>
          <p className="text-gray-600">2205 Pleasant Hill Rd</p>
          <p className="text-gray-600">Augusta, GA 33496</p>
          <p className="text-gray-600">Phone: (987) 654-3210</p>
          <p className="text-gray-600">Email: robert.pearson@example.com</p>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left py-2 px-4 font-semibold text-gray-700">Item</th>
            <th className="text-left py-2 px-4 font-semibold text-gray-700">Description</th>
            <th className="text-right py-2 px-4 font-semibold text-gray-700">Quantity</th>
            <th className="text-right py-2 px-4 font-semibold text-gray-700">Price</th>
            <th className="text-right py-2 px-4 font-semibold text-gray-700">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b">Onboarding Meeting</td>
            <td className="py-2 px-4 border-b">Initial consultation and project setup</td>
            <td className="py-2 px-4 border-b text-right">1</td>
            <td className="py-2 px-4 border-b text-right">$125.00</td>
            <td className="py-2 px-4 border-b text-right">$125.00</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b">Service 1</td>
            <td className="py-2 px-4 border-b">Custom software development</td>
            <td className="py-2 px-4 border-b text-right">10</td>
            <td className="py-2 px-4 border-b text-right">$38.00</td>
            <td className="py-2 px-4 border-b text-right">$380.00</td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="text-right w-64">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Subtotal:</span>
            <span>$505.00</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Tax (8.5%):</span>
            <span>$42.93</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t border-gray-300 pt-2">
            <span>Total:</span>
            <span>$547.93</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-600">
        <h4 className="font-semibold mb-2">Payment Terms:</h4>
        <p>Please pay the total amount within 30 days of the invoice date. We accept bank transfers and credit card payments.</p>
        <p className="mt-2">Thank you for your business!</p>
      </div>
    </div>
  );
}

