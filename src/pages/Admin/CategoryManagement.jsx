import React, { useState, useEffect } from "react";
import { Typography, Card, Spinner, Input, Button } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
} from "../../services/categoryService";
import CategoryActions from "../../components/Admin/CategoryActions.jsx";
import AddCategoryModal from "../../components/Admin/AddCategoryModal.jsx";
import EditCategoryModal from "../../components/Admin/EditCategoryModal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ChangeCategoryStatusButton from "../../components/Admin/ChangeCategoryStatusButton.jsx";
import ConfirmDeleteSportModal from "../../components/Admin/ConfirmDeleteSportModal.jsx";
import ConfirmDeleteCategoryModal from "../../components/Admin/ConfirmDeleteCategoryModal.jsx";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]); // State for filtered categories
  const [loading, setLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState(""); // Search input state

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteCategoryModalOpen, setIsConfirmDeleteCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch categories
  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await fetchCategories();

      const activeCategories = response
        .filter(category => category.status === true)
        .sort((a, b) => b.id - a.id);

      setCategories(activeCategories);
      setFilteredCategories(activeCategories);
      setCurrentPage(1);
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy dữ liệu danh mục.");
      toast.error("Không thể lấy dữ liệu danh mục!", { position: "top-right" });
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchCategoryData();
  }, [isReload]);

  // Filter categories based on the search term
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = categories.filter(
      (category) =>
        category.categoryName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        category.sportName?.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredCategories(filtered);
    setCurrentPage(1); // Reset pagination when search changes
  }, [searchTerm, categories]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddCategory = async (categoryData) => {
    try {
      await createCategory(categoryData);
      fetchCategoryData();
      toast.success("Thêm danh mục thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Thêm danh mục thất bại!", { position: "top-right" });
    }
  };

  const handleEditCategory = async (categoryId, updatedData) => {
    try {
      await updateCategoryById(categoryId, updatedData);
      fetchCategoryData();
      toast.success("Cập nhật danh mục thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Cập nhật danh mục thất bại!", { position: "top-right" });
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
      try {
        await deleteCategoryById(categoryId);
        fetchCategoryData();
        toast.success("Danh mục đã được xóa!", { position: "top-right" });
      } catch (error) {
        toast.error("Xóa danh mục thất bại!", { position: "top-right" });
      }
    }
  };

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
            <Typography variant="h4" className="p-4 text-center">
              Quản lý <span className="text-orange-500">[Danh Mục]</span> ({filteredCategories.length})
            </Typography>
            <Button
              onClick={() => setIsAddModalOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} />{" "}
              Tạo mới
            </Button>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            <input
              type="text"
              placeholder="Tìm kiếm danh mục..."
              className="w-full p-2 border border-gray-300 rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                    <th className="p-4 border-b">Hình Ảnh</th>
                    <th className="p-4 border-b">Tên Danh Mục</th>
                    <th className="p-4 border-b">Môn Thể Thao</th>
                    <th className="p-4 border-b">Trạng Thái</th>
                    <th className="p-4 border-b"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b">{indexOfFirstItem + index + 1}</td>
                      <td className="p-4 border-b">
                        <img
                          src={category.categoryImgPath}
                          alt={category.categoryName}
                          className="h-10 w-10 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 border-b">{category.categoryName}</td>
                      <td className="p-4 border-b">{category.sportName}</td>
                      <td className="p-4 border-b">
                        <ChangeCategoryStatusButton
                          category={category}
                          isActive={category.status}
                          setIsReload={setIsReload}
                        />

                      </td>
                      <td className="p-4 border-b">
                        <CategoryActions
                          category={category}
                          onEdit={() => {
                            setSelectedCategory(category);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => {
                            setSelectedCategory(category);
                            setIsConfirmDeleteCategoryModalOpen(true);
                          }}
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
                    className={`px-3 py-1 mx-1 border rounded ${currentPage === number + 1 ? "bg-black text-white" : "bg-gray-200"
                      }`}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
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


        {/* Delete Category Modal */}
        {isConfirmDeleteCategoryModalOpen && selectedCategory && (
          <ConfirmDeleteCategoryModal
            isOpen={isConfirmDeleteCategoryModalOpen}
            onClose={() => setIsConfirmDeleteCategoryModalOpen(false)}
            category={selectedCategory}
            setIsReload={setIsReload}
          />
        )}
      </div>
    </>
  );
};

export default CategoryManagement;
