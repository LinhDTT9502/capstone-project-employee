import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Spinner,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import {
  fetchImportHistory,
  fetchImportHistoryByBranch,
  removeImportHistory,
} from "../../services/Admin/ImportService";
import { fetchBranchs } from "../../services/branchService";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

const ListImportHistory = () => {
  const [importList, setImportList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImport, setSelectedImport] = useState(null);

  const itemsPerPage = 10;

  const fetchListImport = async () => {
    try {
      setLoading(true);
      const data = await fetchImportHistory();
      setImportList(data);
    } catch (error) {
      console.error("Error fetching list:", error);
      toast.error("Không thể lấy dữ liệu lịch sử nhập hàng!");
    } finally {
      setLoading(false);
    }
  };

  const getListBranch = async () => {
    try {
      const data = await fetchBranchs();
      setBranches(data);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Không thể lấy danh sách chi nhánh!");
    }
  };

  useEffect(() => {
    fetchListImport();
    getListBranch();
  }, []);

  useEffect(() => {
    if (branches.length > 0) {
      const firstBranchId = branches[0].id;
      setSelectedBranch(firstBranchId);
      fetchImportHistoryByBranch(firstBranchId); // Fetch data for the first branch
    }
  }, [branches]); // Run this effect whenever the branches array changes

  const handleBranchSelect = async (branchId) => {
    setSelectedBranch(branchId);
    setLoading(true);

    try {
      if (branchId) {
        const data = await fetchImportHistoryByBranch(branchId);
        setImportList(data);
      } else {
        const data = await fetchImportHistory();
        setImportList(data);
      }
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching filtered list:", error);
      toast.error("Không thể lấy dữ liệu cho chi nhánh này!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (importItem) => {
    setSelectedImport(importItem);
    setModalOpen(true);
  };

  const handleDelete = async (importId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mục này không?")) {
      try {
        await removeImportHistory(importId);
        toast.success("Xóa thành công!");
        if (selectedBranch) {
          const updatedList = await fetchImportHistoryByBranch(selectedBranch);
          setImportList(updatedList);
        } else {
          fetchListImport();
        }
      } catch (error) {
        toast.error("Xóa thất bại!");
      }
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = importList.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(currentItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover
      />
      <Card className="shadow-lg">
        <div className="p-4 flex justify-between items-center">
          <Typography variant="h4"
            color="blue-gray"
            className="p-4 text-center"
          >
            Quản lý <span className="text-orange-500">[Lịch Sử Nhập Hàng]</span>
          </Typography>
        </div>

        <div>
          {/* Filter Tabs */}
          <div className="flex space-x-4 border-b p-2">
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => handleBranchSelect(branch.id)}
                className={`px-4 py-2 ${selectedBranch === branch.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200"
                  } rounded`}
              >
                {branch.branchName.split("2Sport ").pop()}
              </button>
            ))}
          </div>
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
                  <th className="p-4 border-b">Tên sản phẩm</th>
                  <th className="p-4 border-b">Ngày nhập</th>
                  <th className="p-4 border-b">Số lượng</th>
                  <th className="p-4 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 border-b">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="p-4 border-b">{item.productName}</td>
                    <td className="p-4 border-b">
                      {new Date(item.importDate).toLocaleString()}
                    </td>
                    <td className="p-4 border-b">{item.quantity}</td>
                    <td className="p-4 border-b"><div className="flex space-x-2">
                      <Button
                        size="md"
                        color="blue"
                        variant="text"
                        className="flex items-center gap-2 px-2 py-2"
                        onClick={() => handleViewDetails(item)}
                      >
                        <FontAwesomeIcon icon={faEye} className="text-sm" />
                      </Button>

                      <Button
                        size="md"
                        color="red"
                        variant="text"
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-2 px-2 py-2"

                      >
                        <FontAwesomeIcon icon={faTrash} className="text-sm	" />
                      </Button></div>
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
                  className={`px-3 py-1 mx-1 border rounded ${currentPage === number + 1
                    ? "bg-black text-white"
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

      {/* Modal for Import Details */}
      <Dialog open={modalOpen} handler={() => setModalOpen(false)} size="xl">
        <DialogHeader className="text-2xl font-bold text-gray-800 border-b pb-4">
          Chi Tiết Nhập Hàng
        </DialogHeader>
        <DialogBody className="p-6">
          {selectedImport && (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-100 p-4 rounded-lg shadow lg:col-span-3">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Hành Động</h3>
                <p className="text-lg text-gray-900">{selectedImport.action}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Mã Nhập Hàng</h3>
                <p className="text-lg text-gray-900">{selectedImport.id}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Tên Sản Phẩm</h3>
                <p className="text-lg text-gray-900">{selectedImport.productName}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Mã Sản Phẩm</h3>
                <p className="text-lg text-gray-900">{selectedImport.productCode}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Ngày Nhập</h3>
                <p className="text-lg text-gray-900">
                  {new Date(selectedImport.importDate).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Người Quản Lý</h3>
                <p className="text-lg text-gray-900">{selectedImport.managerName}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Mã Người Quản Lý</h3>
                <p className="text-lg text-gray-900">{selectedImport.managerId}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Giá Bán</h3>
                <p className="text-lg text-gray-900">
                  {selectedImport.price.toLocaleString("Vi-vn")} ₫
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Giá Thuê</h3>
                <p className="text-lg text-gray-900">
                  {selectedImport.rentPrice.toLocaleString("Vi-vn")} ₫
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Màu Sắc</h3>
                <p className="text-lg text-gray-900">{selectedImport.color}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Kích Thước</h3>
                <p className="text-lg text-gray-900">{selectedImport.size}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Tình Trạng</h3>
                <p className="text-lg text-gray-900">{selectedImport.condition}%</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg shadow">
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Số Lượng Nhập</h3>
                <p className="text-lg text-gray-900">{selectedImport.quantity}</p>
              </div>

            </div>
          )}
        </DialogBody>

      </Dialog>
    </div>
  );
};

export default ListImportHistory;
