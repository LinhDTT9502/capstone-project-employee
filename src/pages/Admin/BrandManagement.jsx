import React, { useState, useEffect } from "react";
import { Typography, Card, Spinner, Input, Button } from "@material-tailwind/react";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ChangeBrandStatusButton from "../../components/Admin/ChangeBrandStatusButton.jsx";
import ConfirmDeleteBrandModal from "../../components/Admin/ConfirmDeleteBrandModal.jsx";

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteBrandModalOpen, setIsConfirmDeleteBrandModalOpen] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBrands = async () => {
    try {
      setLoading(true);

      const response = await getAllBrands();

      const activeBrands = response
        .filter((brand) => brand.status)
        .sort((a, b) => b.id - a.id);

      setBrands(activeBrands);
      setFilteredBrands(activeBrands);
      setCurrentPage(1);
    } catch (error) {
      setError("Đã xảy ra lỗi khi lấy dữ liệu thương hiệu.");
      toast.error("Không thể lấy dữ liệu thương hiệu!", {
        position: "top-right",
      });
      setBrands([]);
      setFilteredBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    setIsReload(false)
  }, [isReload]);

  // Filter brands based on search term
  useEffect(() => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = brands.filter((brand) =>
      brand.brandName?.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredBrands(filtered);
    setCurrentPage(1); // Reset to the first page when search term changes
  }, [searchTerm, brands]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

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
            <Typography variant="h4" className="p-4 text-center">
              Quản lý <span className="text-orange-500">[Thương Hiệu]</span> ({filteredBrands.length})
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
              placeholder="Tìm kiếm thương hiệu..."
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
                    <th className="p-4 border-b">Tên Thương Hiệu</th>
                    <th className="p-4 border-b">Logo</th>
                    <th className="p-4 border-b">Trạng Thái</th>
                    <th className="p-4 border-b"></th>
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
                          className="h-10 w-30 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 border-b">
                        <ChangeBrandStatusButton
                          brand={brand}
                          isActive={brand.status}
                          setIsReload={setIsReload}
                        />
                      </td>
                      <td className="p-4 border-b">
                        <BrandActions
                          brand={brand}
                          onEdit={() => {
                            setSelectedBrand(brand);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => {
                            setSelectedBrand(brand);
                            setIsConfirmDeleteBrandModalOpen(true);
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

        {/* Add Brand Modal */}
        {isAddModalOpen && (
          <AddBrandModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            setIsReload={setIsReload}
          />
        )}

        {/* Edit Brand Modal */}
        {isEditModalOpen && selectedBrand && (
          <EditBrandModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            brand={selectedBrand}
            setIsReload={setIsReload}
          />
        )}

        {/* Delete Brand Modal */}
        {isConfirmDeleteBrandModalOpen && selectedBrand && (
          <ConfirmDeleteBrandModal
            isOpen={isConfirmDeleteBrandModalOpen}
            onClose={() => setIsConfirmDeleteBrandModalOpen(false)}
            brand={selectedBrand}
            setIsReload={setIsReload}
          />
        )}
      </div>
    </>
  );
};

export default BrandManagement;
