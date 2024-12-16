import React, { useState, useEffect } from "react";
import { Typography, Card, Spinner } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import {
  getAllPromotions,
  createOrUpdatePromotion,
  deletePromotion,
} from "../../services/promotionService";
import SearchModal from "../../components/Admin/SearchModal.jsx";
import PromotionActions from "../../components/Admin/PromotionActions.jsx";
import EditPromotionModal from "../../components/Admin/EditPromotionModal.jsx";

export default function PromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await getAllPromotions();
      setPromotions(response?.data?.$values || []);
      setCurrentPage(1);
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy danh sách khuyến mãi.");
      toast.error("Không thể lấy dữ liệu khuyến mãi!", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleAddPromotion = async (productName, discount) => {
    try {
      await createOrUpdatePromotion(productName, discount);
      fetchPromotions();
      toast.success("Khuyến mãi được cập nhật thành công!", {
        position: "top-right",
      });
    } catch (error) {
      toast.error("Cập nhật khuyến mãi thất bại!", { position: "top-right" });
    }
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setIsEditModalOpen(true);
  };

  const handleDeletePromotion = async (productName) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này không?")) {
      try {
        await deletePromotion(productName);
        fetchPromotions();
        toast.success("Xóa khuyến mãi thành công!", { position: "top-right" });
      } catch (error) {
        toast.error("Xóa khuyến mãi thất bại!", { position: "top-right" });
      }
    }
  };

  const handleSavePromotion = async (productName, discount) => {
    try {
      await createOrUpdatePromotion(productName, discount);
      fetchPromotions();
      toast.success("Khuyến mãi được cập nhật thành công!", {
        position: "top-right",
      });
    } catch (error) {
      toast.error("Cập nhật khuyến mãi thất bại!", { position: "top-right" });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPromotions = promotions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(promotions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 99999 }}
      />
      <div className="container mx-auto p-4">
        <Card className="shadow-lg">
          <div className="flex justify-between items-center p-4">
            <Typography variant="h4" color="blue-gray">
              Quản lý Khuyến Mãi
            </Typography>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow"
              onClick={() => setIsModalOpen(true)}
            >
              Thêm Khuyến Mãi
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
            <div className="overflow-x-auto  p-4">
              <table className="min-w-full border border-gray-200 bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-4 border-b">#</th>
                    <th className="p-4 border-b">Mã Sản Phẩm</th>
                    <th className="p-4 border-b">Tên Sản Phẩm</th>
                    <th className="p-4 border-b">Hình Ảnh</th>
                    <th className="p-4 border-b">Khuyến Mãi (%)</th>
                    <th className="p-4 border-b">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPromotions.length > 0 ? (
                    currentPromotions.map((promotion, index) => (
                      <tr
                        key={promotion.productName}
                        className="hover:bg-gray-50"
                      >
                        <td className="p-4 border-b">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="p-4 border-b">
                          {promotion.productCode}
                        </td>
                        <td className="p-4 border-b">
                          {promotion.productName}
                        </td>
                        <td className="p-4 border-b">
                          <img
                            src={promotion.imgAvatarPath}
                            alt={promotion.productName}
                            className="h-10 w-10 object-cover rounded"
                          />
                        </td>
                        <td className="p-4 border-b">{promotion.discount}%</td>
                        <td className="p-4 border-b">
                          <PromotionActions
                            promotion={promotion}
                            onEdit={handleEditPromotion}
                            onDelete={handleDeletePromotion}
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center p-4">
                        Không có khuyến mãi nào.
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
        {/* Add Promotion Modal */}
        <SearchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddPromotion={handleAddPromotion}
        />
      </div>

      <EditPromotionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSavePromotion}
        promotion={selectedPromotion}
      />
    </>
  );
}
