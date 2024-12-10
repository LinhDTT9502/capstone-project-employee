import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Spinner, Button } from "@material-tailwind/react";
import CreateStaffModal from "./CreateStaffModal";

const ListAllStaff = () => {
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStaffData = async () => {
    try {
      const response = await fetch(
        "https://capstone-project-703387227873.asia-southeast1.run.app/api/Staff/get-all-staffs",
        {
          headers: { accept: "*/*" },
        }
      );
      const result = await response.json();

      if (result.isSuccess) {
        setStaffData(result.data.$values);
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
        <div className="flex justify-between items-center">
        <Typography variant="h4" color="blue-gray" className="p-4 text-center">
        Danh sách nhân viên
        </Typography>
        <Button
        onClick={handleCreateStaff}
        
      >
        Tạo mới
      </Button></div>
        
        {loading ? (
          <div className="flex justify-center p-4">
            <Spinner className="h-10 w-10" />
          </div>
        ) : error ? (
          <Typography
            variant="h6"
            color="red"
            className="text-center p-4"
          >
            {error}
          </Typography>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 border-b">#</th>
                  <th className="p-4 border-b">Name</th>
                  <th className="p-4 border-b">Email</th>
                  <th className="p-4 border-b">Position</th>
                  <th className="p-4 border-b">Phone</th>
                  <th className="p-4 border-b">Start Date</th>
                  <th className="p-4 border-b">Active</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((staff, index) => (
                  <tr key={staff.staffId} className="hover:bg-gray-50">
                    <td className="p-4 border-b">{index + 1}</td>
                    <td
                      className="p-4 border-b font-bold cursor-pointer hover:underline"
                      onClick={() => navigate(`/admin/manage-staff/${staff.staffId}`)}
                    >
                      {staff.userVM.fullName}
                    </td>
                    <td className="p-4 border-b">{staff.userVM.email}</td>
                    <td className="p-4 border-b">{staff.position}</td>
                    <td className="p-4 border-b">{staff.userVM.phoneNumber}</td>
                    <td className="p-4 border-b">
                      {new Date(staff.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-b">
                      {staff.isActive ? (
                        <span className="text-green-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-red-600 font-semibold">No</span>
                      )}
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
