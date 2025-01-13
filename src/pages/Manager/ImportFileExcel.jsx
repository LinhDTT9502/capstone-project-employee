import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ImportFileExcel = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Loading state

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Handle API call
    const handleImport = async () => {
        if (!selectedFile) {
            toast.warning("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("importFile", selectedFile);
        const token = localStorage.getItem("token");
        setIsLoading(true); // Show loading modal

        try {
            const response = await fetch(
                "https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Product/import-product-from-excel",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            if (response.status === 200) {
                toast.success("Nhập kho thành công!");
            } else {
                toast.error("Nhập kho thất bại!.");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Xảy ra sự cố.");
        } finally {
            setIsLoading(false); // Hide loading modal
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn file Excel
            </label>
            <div className="flex items-center space-x-4">
                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                />
                <button
                    onClick={handleImport}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Nhập
                </button>
            </div>

            {/* Loading Modal */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-md shadow-lg">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
                        <p className="text-gray-700 text-lg">Đang xử lý...</p>
                    </div>
                </div>
            )}

            {/* Toast notifications */}
            <ToastContainer />
        </div>
    );
};

export default ImportFileExcel;
