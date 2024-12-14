import React, { useState, useEffect } from "react";
import { Typography, Card, Spinner } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchCategories,
  fetchCategoryDetails,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} from "../../services/categoryService";
import CategoryActions from "../../components/Admin/CategoryActions.jsx";
import AddCategoryModal from "../../components/Admin/AddCategoryModal.jsx";
import EditCategoryModal from "../../components/Admin/EditCategoryModal.jsx";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch all categories
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await fetchCategories();
      setCategories(response.$values); // Adjust based on your API response structure
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy dữ liệu.");
      toast.error("Không thể lấy dữ liệu danh mục!", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  // Add category handler
  const handleAddCategory = async (categoryData) => {
    try {
      await createCategory(categoryData);
      fetchCategoryData();
      toast.success("Thêm danh mục thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Thêm danh mục thất bại!", { position: "top-right" });
      console.error("Error adding category:", error);
    }
  };

  // Edit category handler
  const handleEditCategory = async (categoryId, updatedData) => {
    try {
      await updateCategoryById(categoryId, updatedData);
      fetchCategoryData();
      toast.success("Cập nhật danh mục thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Cập nhật danh mục thất bại!", { position: "top-right" });
      console.error("Error editing category:", error);
    }
  };

  // Delete category handler
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      try {
        await deleteCategoryById(categoryId);
        setCategories((prev) => prev.filter((category) => category.id !== categoryId));
        toast.success("Danh mục đã được xóa!", { position: "top-right" });
      } catch (error) {
        toast.error("Xóa danh mục thất bại!", { position: "top-right" });
        console.error("Error deleting category:", error);
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
              Quản lý Danh Mục
            </Typography>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow"
              onClick={() => setIsAddModalOpen(true)}
            >
              Thêm Danh Mục
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
                    <th className="p-4 border-b">Hình Ảnh</th>
                    <th className="p-4 border-b">Tên Danh Mục</th>
                    <th className="p-4 border-b">Môn thể thao</th>
                    <th className="p-4 border-b">ID Môn thể thao</th>
                    
                    <th className="p-4 border-b">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b">{index + 1}</td>
                      <td className="p-4 border-b">
                        <img
                          src={category.categoryImgPath}
                          alt={category.categoryName}
                          className="h-10 w-10 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 border-b">{category.categoryName}</td>
                      <td className="p-4 border-b">{category.sportName}</td>
                      <td className="p-4 border-b">{category.sportId}</td>
                      
                      <td className="p-4 border-b">
                        <CategoryActions
                          category={category}
                          onEdit={() => {
                            setSelectedCategory(category);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => handleDeleteCategory(category.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Add Category Modal */}
        {isAddModalOpen && (
          <AddCategoryModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddCategory={handleAddCategory}
          />
        )}

        {/* Edit Category Modal */}
        {isEditModalOpen && selectedCategory && (
          <EditCategoryModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEditCategory={handleEditCategory}
            category={selectedCategory}
          />
        )}
      </div>
    </>
  );
};

export default CategoryManagement;