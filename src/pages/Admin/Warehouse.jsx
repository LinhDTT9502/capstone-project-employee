import React, { useState, useEffect } from "react";
import {
  Spinner,
  Card,
  Typography,
  Dialog,
  DialogHeader,
  DialogBody,
  Button,
} from "@material-tailwind/react";
import {
  getAllWarehouses,
  fetchProductsbyBranch,
} from "../../services/warehouseService";
import { fetchBranchs } from "../../services/branchService";
import { ToastContainer, toast } from "react-toastify";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Warehouse = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
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
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar pauseOnHover />
      <Card className="shadow-lg">
        <div className="p-4 flex justify-between items-center">
          <Typography variant="h4" color="blue-gray">
            Quản lý Kho Hàng ({warehouses.length})
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
                  <th className="p-4 border-b">Hành động</th>
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
                    <td className="p-4 border-b">
                      <Button
                        size="md"
                        color="blue"
                        variant="text"
                        className="flex items-center gap-2 px-4 py-2"
                        onClick={() => handleViewDetails(item)}
                      >
                        <FontAwesomeIcon icon={faEye} className="text-sm" />
                      </Button>
                    </td>
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
                    currentPage === number + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Modal for Product Details */}
      <Dialog open={modalOpen} handler={() => setModalOpen(false)} size="xl">
        <DialogHeader className="text-2xl font-bold text-gray-800 border-b pb-4">
          Chi Tiết Sản Phẩm
        </DialogHeader>
        <DialogBody className="p-6">
          {selectedProduct && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <img
                  src={selectedProduct.imgAvatarPath}
                  alt={selectedProduct.productName}
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg"
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedProduct.productName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Mã Sản Phẩm</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.productCode}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Màu Sắc</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.color}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Kích Thước</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.size}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Tình Trạng</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.condition}%</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Chi Nhánh</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.branchName}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Tổng Số Lượng</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.totalQuantity}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Số Lượng Có Sẵn</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedProduct.availableQuantity}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
      </Dialog>
    </div>
  );
};

export default Warehouse;
