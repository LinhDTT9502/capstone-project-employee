import React, { useState, useEffect } from "react";
import { Typography, Card, Spinner } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import {
  getAllBrands,
  createBrand,
  updateBrand,
  removeBrand,
} from "../../services/brandService";
import BrandActions from "../../components/Admin/BrandActions.jsx";
import AddBrandModal from "../../components/Admin/AddBrandModal.jsx";
import EditBrandModal from "../../components/Admin/EditBrandModal.jsx";

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all brands
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await getAllBrands();
      setBrands(response?.$values || []);
      setCurrentPage(1); // Reset pagination when fetching new data
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy dữ liệu thương hiệu.");
      toast.error("Không thể lấy dữ liệu thương hiệu!", { position: "top-right" });
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = brands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(brands.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Add brand handler
  const handleAddBrand = async (formData) => {
    try {
      await createBrand(formData);
      fetchBrands();
      toast.success("Thêm thương hiệu thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Thêm thương hiệu thất bại!", { position: "top-right" });
    }
  };

  // Edit brand handler
  const handleEditBrand = async (brandId, formData) => {
    try {
      await updateBrand(brandId, formData);
      fetchBrands();
      toast.success("Cập nhật thương hiệu thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Cập nhật thương hiệu thất bại!", { position: "top-right" });
    }
  };

  // Delete brand handler
  const handleDeleteBrand = async (brandId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này không?")) {
      try {
        await removeBrand(brandId);
        fetchBrands();
        toast.success("Thương hiệu đã được xóa!", { position: "top-right" });
      } catch (error) {
        toast.error("Xóa thương hiệu thất bại!", { position: "top-right" });
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto p-4">
        <Card className="shadow-lg">
          <div className="flex justify-between items-center p-4">
            <Typography variant="h4" color="blue-gray">
              Quản lý Thương Hiệu
            </Typography>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow"
              onClick={() => setIsAddModalOpen(true)}
            >
              Thêm Thương Hiệu
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-4">
              <Spinner className="h-10 w-10" />
            </div>
          ) : error ? (
            <Typography variant="h6" color="red" className="text-center p-4">
              {error}
            </Typography>
          ) : (
            <div className="overflow-x-auto p-4">
              <table className="min-w-full border border-gray-200 bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-4 border-b">#</th>
                    <th className="p-4 border-b">Tên Thương Hiệu</th>
                    <th className="p-4 border-b">Hình Ảnh</th>
                    <th className="p-4 border-b">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBrands.map((brand, index) => (
                    <tr key={brand.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b">{indexOfFirstItem + index + 1}</td>
                      <td className="p-4 border-b">{brand.brandName}</td>
                      <td className="p-4 border-b">
                        <img
                          src={brand.logo}
                          alt={brand.brandName}
                          className="h-10 w-10 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 border-b">
                        <BrandActions
                          brand={brand}
                          onEdit={() => {
                            setSelectedBrand(brand);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => handleDeleteBrand(brand.id)}
                        />
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

        {/* Add Brand Modal */}
        {isAddModalOpen && (
          <AddBrandModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddBrand={handleAddBrand}
          />
        )}

        {/* Edit Brand Modal */}
        {isEditModalOpen && selectedBrand && (
          <EditBrandModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEditBrand={handleEditBrand}
            brand={selectedBrand}
          />
        )}
      </div>
    </>
  );
};

export default BrandManagement;
