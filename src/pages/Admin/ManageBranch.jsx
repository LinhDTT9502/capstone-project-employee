import React, { useState, useEffect } from "react";
import { Typography, Card, Spinner, Input, Button, Switch } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import BrandActions from "../../components/Admin/BrandActions.jsx";
import AddBrandModal from "../../components/Admin/AddBrandModal.jsx";
import EditBrandModal from "../../components/Admin/EditBrandModal.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { addNewBranch, getBranchs, removeBranch } from "../../services/branchService.js";
import BranchActions from "../../components/Admin/BranchActions.jsx";
import AddBranchModal from "../../components/Admin/AddBranchModal.jsx";
import { createBranch } from "../../api/apiBranch.js";
import ChangeBranchStatusButton from "../../components/Admin/ChangeBranchStatusButton.jsx";
import EditBranchModal from "../../components/Admin/EditBranchModal.jsx";
import ConfirmDeleteBranchModal from "../../components/Admin/ConfirmDeleteBranchModal.jsx";

const ManageBranch = () => {
  const [branchs, setBranchs] = useState([]);
  const [filteredBranches, setFilteredBranchs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [confirmDeleteBranchModalOpen, setConfirmDeleteBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchBranchs = async () => {
    try {
      setLoading(true);

      const response = await getBranchs(); // Sửa ở đây
      const branches = response
        .sort((a, b) => b.id - a.id);

      setBranchs(branches);
      setFilteredBranchs(branches);
      setCurrentPage(1);
    } catch (error) {
      setError("Đã xảy ra lỗi khi lấy dữ liệu thương hiệu.");
      toast.error("Không thể lấy dữ liệu thương hiệu!", {
        position: "top-right",
      });
      setBranchs([]);
      setFilteredBranchs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchs();
    setIsReload(false)
  }, [isReload]);

  // Filter brands based on search term
  useEffect(() => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = branchs.filter((branch) =>
      branch.branchName?.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredBranchs(filtered);
    setCurrentPage(1);
  }, [searchTerm, branchs]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBranchs = filteredBranches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddBranch = async (formData) => {
    try {
      console.log(formData)

      fetchBranchs();
      toast.success("Thêm chi nhánh thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Thêm chi nhánh thất bại!", { position: "top-right" });
    }
  };



  const handleDeleteBranch = async (branchId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chi nhánh này không?")) {
      try {
        var response = await removeBranch(branchId);

        fetchBranchs(); // Gọi lại hàm fetchBranchs để lấy lại danh sách chi nhánh
        toast.success("Chi nhánh đã được xóa!");
      } catch (error) {
        toast.error("Có lỗi xảy ra khi xóa chi nhánh.");
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
              Quản lý <span className="text-orange-500">[Chi Nhánh]</span> ({filteredBranches.length})
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
              placeholder="Tìm kiếm chi nhánh..."
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
                    <th className="p-4 border-b">Tên chi nhánh</th>
                    <th className="p-4 border-b">Hình ảnh</th>
                    <th className="p-4 border-b">Địa chỉ</th>
                    <th className="p-4 border-b">Hotline</th>
                    <th className="p-4 border-b">Trạng thái</th>

                    <th className="p-4 border-b"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentBranchs.map((branch, index) => (
                    <tr key={branch.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b">{indexOfFirstItem + index + 1}</td>
                      <td className="p-4 border-b">{branch.branchName}</td>
                      <td className="p-4 border-b">
                        <img
                          src={branch.imgAvatarPath}
                          alt={branch.brandName}
                          className="h-10 w-30 object-cover rounded"
                        />
                      </td>
                      <td className="p-4 border-b">{branch.location}</td>
                      <td className="p-4 border-b">{branch.hotline}</td>
                      <td className="p-4 border-b">
                        <ChangeBranchStatusButton
                          branch={branch}
                          isActive={branch.status}
                          setIsReload={setIsReload}
                        />

                      </td>

                      <td className="p-4 border-b">
                        <BranchActions
                          branch={branch}
                          onEdit={() => {
                            setSelectedBranch(branch);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => {
                            setSelectedBranch(branch);
                            setConfirmDeleteBranchModalOpen(true);
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

        {/* Add Branch Modal */}
        {isAddModalOpen && (
          <AddBranchModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            setIsReload={setIsReload}
          />
        )}

        {/* Edit Branch Modal */}
        {isEditModalOpen && selectedBranch && (
          <EditBranchModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            branch={selectedBranch}
            setIsReload={setIsReload}
          />
        )}

        {/* Delete Branch Modal */}
        {confirmDeleteBranchModalOpen && selectedBranch && (
          <ConfirmDeleteBranchModal
            isOpen={confirmDeleteBranchModalOpen}
            onClose={() => setConfirmDeleteBranchModalOpen(false)}
            branch={selectedBranch}
            setIsReload={setIsReload}
          />
        )}
      </div>
    </>
  );
};

export default ManageBranch;
