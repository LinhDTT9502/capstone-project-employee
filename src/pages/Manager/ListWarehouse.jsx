import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { editQuantity, fetchProductsbyBranch } from '../../services/warehouseService';
import { toast } from 'react-toastify';
import { Button, Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPencil, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchBranchDetail } from '../../services/branchService';

const ListWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [branch, setBranch] = useState(null);
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [editableTotalQuantity, setEditableTotalQuantity] = useState(selectedProduct?.totalQuantity || 0);
  const [editableAvailableQuantity, setEditableAvailableQuantity] = useState(selectedProduct?.availableQuantity || 0);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await fetchProductsbyBranch(user.BranchId);

      // Sorting warehouses by 'id' in descending order
      const sortedWarehouses = data.sort((a, b) => b.id - a.id);

      setWarehouses(sortedWarehouses);
      console.log(sortedWarehouses); // Log the sorted data
    } catch {
      toast.error('Không thể lấy dữ liệu kho hàng!');
    } finally {
      setLoading(false);
    }
  };

  const fetchBranch = async () => {
    try {
      setLoading(true);
      const data = await fetchBranchDetail(user.BranchId);

      setBranch(data);
      console.log(data);
    } catch {
      toast.error('Không thể lấy dữ liệu chi nhánh!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranch();
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [user.BranchId]);

  useEffect(() => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = warehouses.filter(
      (warehouse) =>
        warehouse.productName?.toLowerCase().includes(lowerCaseTerm) ||
        warehouse.productCode?.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredWarehouses(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, warehouses]);

  useEffect(() => {
    if (selectedProduct) {
      setEditableTotalQuantity(selectedProduct.totalQuantity || 0);
      setEditableAvailableQuantity(selectedProduct.availableQuantity || 0);
      console.log(selectedProduct);

    }
  }, [selectedProduct]);


  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const showEditQuantity = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWarehouses.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(warehouses.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Edit quantity handler
  const handleEditQuantity = async () => {
    try {
      const response = await editQuantity(selectedProduct.id, editableAvailableQuantity, editableTotalQuantity);
      console.log(response);

      if (response === 'Update warehouse successfully!') {
        fetchWarehouses();

        toast.success("Cập nhật kho thành công!");
      } else {
        toast.error("Cập nhật kho thất bại!");
      }
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Lỗi xảy ra khi cập nhật kho.");
      console.error("Error updating user:", error);
    }
  };

  return (


    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Modal for Product Details */}
      <Dialog open={viewModalOpen} handler={() => setViewModalOpen(false)} size="xl">
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

      {/* Modal for Edit Quantity Warehouse */}
      <Dialog open={isEditModalOpen} handler={() => setIsEditModalOpen(false)} size="xl">
        <DialogHeader className="text-2xl font-bold text-gray-800 border-b pb-4">
          Chi Tiết Sản Phẩm
        </DialogHeader>
        <DialogBody className="p-6">
          {selectedProduct && (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Product Image */}
              <div className="md:w-1/3">
                <img
                  src={selectedProduct.imgAvatarPath}
                  alt={selectedProduct.productName}
                  className="w-full h-auto max-h-96 object-contain rounded-lg shadow-lg"
                />
              </div>

              {/* Product Details */}
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedProduct.productName}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Static Fields */}
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

                  {/* Editable Fields */}
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Tổng Số Lượng</p>
                    <input
                      type="number"
                      value={editableTotalQuantity}
                      onChange={(e) => setEditableTotalQuantity(e.target.value)}
                      className="mt-1 text-sm text-gray-900 border border-gray-300 rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-500">Số Lượng Có Sẵn</p>
                    <input
                      type="number"
                      value={editableAvailableQuantity}
                      onChange={(e) => setEditableAvailableQuantity(e.target.value)}
                      className="mt-1 text-sm text-gray-900 border border-gray-300 rounded-md w-full p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogBody>
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={handleEditQuantity}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Lưu
          </button>
        </div>
      </Dialog>

      <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm trong chi nhánh <span className='text-orange-500 font-bold'>{branch?.branchName ?? ""}</span></h2>
      <div className="p-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-4 border-b">#</th>
              <th className="p-4 border-b">Ảnh</th>
              <th className="p-4 border-b">Tên Sản Phẩm</th>
              <th className="p-4 border-b">Thuộc tính</th>
              <th className="p-4 border-b">Tổng Số Lượng</th>
              <th className="p-4 border-b">Số Lượng Có Sẵn</th>
              <th className="p-4 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {warehouses.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 border-b">{indexOfFirstItem + index + 1}</td>
                  <td className="p-4 border-b">
                    {item.imgAvatarPath && (
                      <img
                        src={item.imgAvatarPath}
                        alt="Product Avatar"
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                  </td>

                  <td className="p-4 border-b">{item.productName}</td>
                  <td className="p-4 border-b">{item.color} - {item.size} - {item.condition}</td>
                  <td className="p-4 border-b">{item.totalQuantity}</td>
                  <td className="p-4 border-b">{item.availableQuantity}</td>
                  <td className="p-4 border-b">
                    <div className="flex gap-2">
                      <Button
                        size="md"
                        color="blue"
                        variant="text"
                        className="flex items-center gap-2 px-4 py-2"
                        onClick={() => handleViewDetails(item)}
                      >
                        <FontAwesomeIcon icon={faEye} className="text-sm" />
                      </Button>
                      <Button
                        size="md"
                        color="blue"
                        variant="text"
                        className="flex items-center gap-2 px-4 py-2"
                        onClick={() => showEditQuantity(item)}
                      >
                        <FontAwesomeIcon icon={faPencilAlt} className="text-sm" />
                      </Button>
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Không có sản phẩm nào trong kho.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => handlePageChange(number + 1)}
              className={`px-3 py-1 mx-1 border rounded ${currentPage === number + 1 ? "bg-black text-white" : "bg-gray-200"
                }`}
            >
              {number + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListWarehouses;
