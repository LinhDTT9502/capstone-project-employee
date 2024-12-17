import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  Typography,
  Spinner,
  Button,
  Input,
} from "@material-tailwind/react";
import CreateStaffModal from "./CreateStaffModal";
import { fetchAllStaff } from "../../services/Staff/StaffService";

const ListAllStaff = () => {
  const [staffData, setStaffData] = useState([]);
  const [filteredStaffData, setFilteredStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStaffData = async () => {
    try {
      const result = await fetchAllStaff();
      console.log(result);

      if (result) {
        setStaffData(result);
        setFilteredStaffData(result);
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
  }, []);

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

  const handleCreateStaff = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = (newStaff) => {
    setIsModalOpen(false);
    if (newStaff) {
      fetchStaffData();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <div className="flex justify-between items-center p-4">
          <Typography variant="h4" color="blue-gray" className="p-4 text-center">
            Danh sách <span className="text-orange-500">[Nhân Viên]</span> ({filteredStaffData.length})
          </Typography>
          <Button onClick={handleCreateStaff}>
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
                  <th className="p-4 border-b">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaffData.map((staff, index) => (
                
                  <tr key={staff.staffId} className="hover:bg-gray-50">

                      {console.log(staff)}

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
                    <Switch
                              color="green"
                              checked={staff.isActive}
                            />
                      {/* {staff.isActive ? (
                        // <span className="text-green-600 font-semibold">
                        //   Hoạt động
                        // </span>
                    
                      ) : (
                        <span className="text-red-600 font-semibold">Vô hiệu hóa</span>
                      )} */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {isModalOpen && <CreateStaffModal onClose={handleModalClose} />}
    </div>
  );
};

export default ListAllStaff;
