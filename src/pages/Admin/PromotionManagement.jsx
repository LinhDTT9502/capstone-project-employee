import React, { useState, useEffect } from "react";
import { Typography, Card, Spinner } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import { getAllPromotions, createOrUpdatePromotion } from "../../services/promotionService";
import SearchModal from "../../components/Admin/SearchModal.jsx";
export default function PromotionManagement() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAddPromotion = (productName, discount) => {
    setPromotions((prev) => [...prev, { productName, discount }]);
    toast.success("Thêm khuyến mãi thành công!", { position: "top-right" });
  };
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch all promotions
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await getAllPromotions();
      setPromotions(response?.data?.$values || []); 
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy danh sách khuyến mãi.");
      toast.error("Không thể lấy dữ liệu khuyến mãi!", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Add or Update Promotion handler
  const handleAddOrUpdatePromotion = async (productName, percentDiscount) => {
    try {
      await createOrUpdatePromotion(productName, percentDiscount);
      fetchPromotions();
      toast.success("Khuyến mãi được cập nhật thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Cập nhật khuyến mãi thất bại!", { position: "top-right" });
      console.error("Error adding/updating promotion:", error);
    }
  };

  return (
    <>
      <ToastContainer />
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
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-4 border-b">#</th>
                    <th className="p-4 border-b">Mã Sản Phẩm</th>
                    <th className="p-4 border-b">Tên Sản Phẩm</th>
                    <th className="p-4 border-b">Hình Ảnh</th>
                    <th className="p-4 border-b">Khuyến Mãi (%)</th>
                    {/* <th className="p-4 border-b">Hành Động</th> */}
                  </tr>
                </thead>
                <tbody>
                  {promotions.length > 0 ? (
                    promotions.map((promotion, index) => (
                      <tr key={promotion.productCode} className="hover:bg-gray-50">
                        <td className="p-4 border-b">{index + 1}</td>
                        <td className="p-4 border-b">{promotion.productCode}</td>
                        <td className="p-4 border-b">{promotion.productName}</td>
                        <td className="p-4 border-b">
                          <img
                            src={promotion.imgAvatarPath}
                            alt={promotion.productName}
                            className="h-10 w-10 object-cover rounded"
                          />
                        </td>
                        <td className="p-4 border-b">{promotion.discount}%</td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-4">
                        Không có khuyến mãi nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
        <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPromotion={handleAddPromotion}
      />
      </div>
    </>
  );
}
