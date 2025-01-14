import React, { useEffect, useState } from "react";
import { Typography, Card, Spinner, Input, Button } from "@material-tailwind/react";
import { fetchSports, createSport, updateSport, deleteSport } from "../../services/sportService";
import SportActions from "../../components/Admin/SportActions.jsx";
import AddSportModal from "../../components/Admin/AddSportModal.jsx";
import EditSportModal from "../../components/Admin/EditSportModal.jsx";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ChangeSportStatusButton from "../../components/Admin/ChangeSportStatusButton.jsx";
import ConfirmDeleteSportModal from "../../components/Admin/ConfirmDeleteSportModal.jsx";

const SportManagement = () => {
  const [sports, setSports] = useState([]);
  const [filteredSports, setFilteredSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteSportModalOpen, setIsConfirmDeleteSportModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all sports
  const fetchSportData = async () => {
    try {
      setLoading(true);
      const response = await fetchSports();
      setSports(response);
      setFilteredSports(response);
      setCurrentPage(1);
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy dữ liệu.");
      toast.error("Không thể lấy dữ liệu môn thể thao!", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSportData();
  }, [isReload]);

  // Filter sports based on search term
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = sports.filter((sport) =>
      sport.name?.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredSports(filtered);
    setCurrentPage(1);
  }, [searchTerm, sports]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSports = filteredSports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSports.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Add sport handler
  const handleAddSport = async (sportData) => {
    try {
      await createSport([{ name: sportData.name }]);
      fetchSportData();
      toast.success("Thêm môn thể thao thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Thêm môn thể thao thất bại!", { position: "top-right" });
    }
  };

  // Edit sport handler
  const handleEditSport = async (sportId, updatedData) => {
    try {
      await updateSport(sportId, updatedData);
      fetchSportData();
      toast.success("Cập nhật môn thể thao thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Cập nhật môn thể thao thất bại!", { position: "top-right" });
    }
  };


  // Delete sport handler
  const handleDeleteSport = async (sportId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa môn thể thao này không?")) {
      try {
        await deleteSport(sportId);
        fetchSportData();
        toast.success("Môn thể thao đã được xóa!", { position: "top-right" });
      } catch (error) {
        toast.error("Xóa môn thể thao thất bại!", { position: "top-right" });
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
            <Typography variant="h4"
              className="p-4 text-center"
            >
              Quản lý <span className="text-orange-500">[Môn Thể Thao]</span> ({filteredSports.length})
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
              placeholder="Tìm kiếm môn thể thao..."
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
                    <th className="p-4 border-b">Tên Môn Thể Thao</th>
                    <th className="p-4 border-b">Trạng thái</th>
                    <th className="p-4 border-b"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentSports.map((sport, index) => (
                    <tr key={sport.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b">{indexOfFirstItem + index + 1}</td>
                      <td className="p-4 border-b">{sport.name}</td>
                      <td className="p-4 border-b">
                        <ChangeSportStatusButton
                          sport={sport}
                          isActive={sport.status}
                          setIsReload={setIsReload}
                        />

                      </td>
                      <td className="p-4 border-b">
                        <SportActions
                          sport={sport}
                          onEdit={() => {
                            setSelectedSport(sport);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => {
                            setSelectedSport(sport);
                            setIsConfirmDeleteSportModalOpen(true);
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

        {/* Add Sport Modal */}
        {isAddModalOpen && (
          <AddSportModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddSport={handleAddSport}
          />
        )}

        {/* Edit Sport Modal */}
        {isEditModalOpen && selectedSport && (
          <EditSportModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onEditSport={handleEditSport}
            sport={selectedSport}
          />
        )}

        {/* Delete Sport Modal */}
        {isConfirmDeleteSportModalOpen && selectedSport && (
          <ConfirmDeleteSportModal
            isOpen={isConfirmDeleteSportModalOpen}
            onClose={() => setIsConfirmDeleteSportModalOpen(false)}
            sport={selectedSport}
            setIsReload={setIsReload}
          />
        )}
      </div>
    </>
  );
};

export default SportManagement;
