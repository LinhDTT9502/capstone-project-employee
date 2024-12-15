import React, { useState, useEffect } from "react";
import { Spinner, Card, Typography } from "@material-tailwind/react";
import { getAllWarehouses, fetchProductsbyBranch } from "../../services/warehouseService";
import { fetchBranchs } from "../../services/branchService";
import { ToastContainer, toast } from "react-toastify";

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      const data = await getAllWarehouses();
      setWarehouses(data);
    } catch {
      toast.error("Không thể lấy dữ liệu kho hàng!");
    } finally {
      setLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      const branchData = await fetchBranchs();
      setBranches(branchData);
    } catch {
      toast.error("Không thể lấy danh sách chi nhánh!");
    }
  };

  const fetchByBranch = async (branchId) => {
    try {
      setLoading(true);
      const data = await fetchProductsbyBranch(branchId);
      setWarehouses(data);
      setCurrentPage(1); 
    } catch {
      toast.error("Không thể lấy dữ liệu sản phẩm theo chi nhánh!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
    loadBranches();
  }, []);

  const handleBranchSelect = (branchId) => {
    setSelectedBranch(branchId);
    if (branchId) {
      fetchByBranch(branchId);
    } else {
      loadWarehouses();
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = warehouses.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(warehouses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <Card className="shadow-lg">
        <div className="p-4 flex justify-between items-center">
          <Typography variant="h4" color="blue-gray">
            Quản lý Kho Hàng
          </Typography>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 border-b p-2">
          <button
            onClick={() => handleBranchSelect(null)}
            className={`px-4 py-2 ${
              selectedBranch === null ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded`}
          >
            Tất Cả
          </button>
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => handleBranchSelect(branch.id)}
              className={`px-4 py-2 ${
                selectedBranch === branch.id ? "bg-blue-500 text-white" : "bg-gray-200"
              } rounded`}
            >
              {branch.branchName}
            </button>
          ))}
        </div>

        {/* Table Data */}
        {loading ? (
          <div className="flex justify-center p-4">
            <Spinner className="h-10 w-10" />
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 border-b">#</th>
                  <th className="p-4 border-b">Tên Sản Phẩm</th>
                  <th className="p-4 border-b">Chi Nhánh</th>
                  <th className="p-4 border-b">Tổng Số Lượng</th>
                  <th className="p-4 border-b">Số Lượng Có Sẵn</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 border-b">{indexOfFirstItem + index + 1}</td>
                    <td className="p-4 border-b">{item.productName}</td>
                    <td className="p-4 border-b">{item.branchName}</td>
                    <td className="p-4 border-b">{item.totalQuantity}</td>
                    <td className="p-4 border-b">{item.availableQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              {[...Array(totalPages).keys()].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => handlePageChange(number + 1)}
                  className={`px-3 py-1 mx-1 border rounded ${
                    currentPage === number + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Warehouse;
