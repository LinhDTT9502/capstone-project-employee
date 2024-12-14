import React, { useEffect, useState } from "react";
import { Typography, Card, Spinner } from "@material-tailwind/react";
import { fetchSports, createSport, updateSport, deleteSport } from "../../services/sportService";
import SportActions from "../../components/Admin/SportActions.jsx";
import AddSportModal from "../../components/Admin/AddSportModal.jsx";
import EditSportModal from "../../components/Admin/EditSportModal.jsx";
import { ToastContainer, toast } from "react-toastify";

const SportManagement = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);

  // Fetch all sports
  const fetchSportData = async () => {
    try {
      setLoading(true);
      const response = await fetchSports();
      setSports(response);
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy dữ liệu.");
      toast.error("Không thể lấy dữ liệu môn thể thao!", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSportData();
  }, []);

  // Add sport handler
  const handleAddSport = async (sportData) => {
    try {
      await createSport([{ name: sportData.name }]);
      fetchSportData();
      toast.success("Thêm môn thể thao thành công!", { position: "top-right" });
    } catch (error) {
      toast.error("Thêm môn thể thao thất bại!", { position: "top-right" });
      console.error("Error adding sport:", error);
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
      console.error("Error editing sport:", error);
    }
  };

  // Delete sport handler
  const handleDeleteSport = async (sportId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa môn thể thao này không?")) {
      try {
        await deleteSport(sportId);
        setSports((prevSports) => prevSports.filter((sport) => sport.id !== sportId));
        toast.success("Môn thể thao đã được xóa!", { position: "top-right" });
      } catch (error) {
        toast.error("Xóa môn thể thao thất bại!", { position: "top-right" });
        console.error("Error deleting sport:", error);
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
              Quản lý Môn Thể Thao
            </Typography>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow"
              onClick={() => setIsAddModalOpen(true)}
            >
              Tạo mới
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
                    <th className="p-4 border-b">Tên Môn Thể Thao</th>
                    <th className="p-4 border-b">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {sports.map((sport, index) => (
                    <tr key={sport.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b">{index + 1}</td>
                      <td className="p-4 border-b">{sport.name}</td>
                      <td className="p-4 border-b">
                        <SportActions
                          sport={sport}
                          onEdit={() => {
                            setSelectedSport(sport);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => handleDeleteSport(sport.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
      </div>
    </>
  );
};

export default SportManagement;
