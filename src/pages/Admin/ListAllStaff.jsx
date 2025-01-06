import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  Typography,
  Spinner,
  Button,
} from "@material-tailwind/react";
import { fetchAllStaff } from "../../services/Staff/StaffService";
import StaffActions from "../../components/Admin/StaffActions";
import EditStaffModal from "../../components/Admin/EditStaffModal";
import ConfirmDeleteStaffModal from "../../components/Admin/ConfirmDeleteStaffModal";
import AddStaffModal from "../../components/Admin/AddStaffModal";

const ListAllStaff = () => {
  const [staffData, setStaffData] = useState([]);
  const [filteredStaffData, setFilteredStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReload, setIsReload] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteStaffModalOpen, setIsConfirmDeleteStaffModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchStaffData = async () => {
    try {
      const result = await fetchAllStaff();

      if (result) {
        // Sort by branchName and startDate
        const sortedData = result.sort((a, b) => {
          // Compare branchName (case-insensitive)
          const branchComparison = b.branchName.localeCompare(a.branchName, undefined, { sensitivity: 'base' });
          if (branchComparison !== 0) return branchComparison;

          // If branchName is the same, compare startDate
          return new Date(a.startDate) - new Date(b.startDate);
        });

        setStaffData(sortedData);
        setFilteredStaffData(sortedData);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchStaffData();
    setIsReload(false);
  }, [isReload]);

  // Filter staff data based on the search term
  useEffect(() => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = staffData.filter(
      (staff) =>
        staff.userVM.fullName.toLowerCase().includes(lowerCaseTerm) ||
        staff.userVM.email.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredStaffData(filtered);
  }, [searchTerm, staffData]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaffs = filteredStaffData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaffData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <div className="flex justify-between items-center p-4">
          <Typography variant="h4" color="blue-gray" className="p-4 text-center">
            Danh sách <span className="text-orange-500">[Nhân Viên]</span> ({filteredStaffData.length})
          </Typography>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} />{" "}
            Tạo mới
          </Button>
        </div>

        {/* Search Input */}

        <div className="p-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
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
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 border-b">#</th>
                  <th className="p-4 border-b">Tên nhân viên</th>
                  <th className="p-4 border-b">Email</th>
                  <th className="p-4 border-b">Chi nhánh</th>
                  <th className="p-4 border-b">Chức vụ</th>
                  <th className="p-4 border-b">Ngày bắt đầu</th>
                  <th className="p-4 border-b">Ngày kết thúc</th>
                  <th className="p-4 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {currentStaffs.map((staff, index) => (

                  <tr key={staff.staffId} className="hover:bg-gray-50">
                    <td className="p-4 border-b">{index + 1}</td>
                    <td
                      className="p-4 border-b font-bold cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(`/admin/manage-staff/${staff.staffId}`)
                      }
                    >
                      {staff.userVM.fullName}
                    </td>
                    <td className="p-4 border-b">{staff.userVM.email}</td>
                    <td className="p-4 border-b">{staff.branchName}</td>
                    <td className="p-4 border-b">{staff.position}</td>
                    <td className="p-4 border-b">
                      {new Date(staff.startDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 border-b">
                      {new Date(staff.endDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 border-b">
                      <StaffActions
                        staff={staff}
                        onEdit={() => {
                          setSelectedStaff(staff);
                          setIsEditModalOpen(true);
                        }}
                        onDelete={() => {
                          setSelectedStaff(staff);
                          setIsConfirmDeleteStaffModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <div className="flex justify-center mt-4 pb-4">
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

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <AddStaffModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          setIsReload={setIsReload}
        />
      )}

      {/* Edit Staff Modal */}
      {isEditModalOpen && selectedStaff && (
        <EditStaffModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          staff={selectedStaff}
          setIsReload={setIsReload}
        />
      )}

      {/* Delete Staff Modal */}
      {isConfirmDeleteStaffModalOpen && selectedStaff && (
        <ConfirmDeleteStaffModal
          isOpen={isConfirmDeleteStaffModalOpen}
          onClose={() => setIsConfirmDeleteStaffModalOpen(false)}
          staff={selectedStaff}
          setIsReload={setIsReload}
        />
      )}
    </div>

  );
};

export default ListAllStaff;
