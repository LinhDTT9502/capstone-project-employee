import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Spinner, Button } from "@material-tailwind/react";

import { fetchAllManagers } from "../../services/Manager/ManagerService";

const ListAllManagers = () => {
  const [managerData, setManagerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchManagerData = async () => {
    try {
      const response = await fetchAllManagers();

      // Assuming response contains an array of managers
      if (response) {
        setManagerData(response); // Directly use the array from the response
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
    fetchManagerData();
  }, []);

  const handleCreateManager = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = (newManager) => {
    setIsModalOpen(false);
    if (newManager) {
      fetchManagerData();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <div className="flex justify-between items-center">
          <Typography variant="h4" color="blue-gray" className="p-4 text-center">
            Danh sách Quản lý
          </Typography>
          <Button onClick={handleCreateManager}>Tạo mới</Button>
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
                  <th className="p-4 border-b">Name</th>
                  <th className="p-4 border-b">Email</th>
                  <th className="p-4 border-b">Phone</th>
                  <th className="p-4 border-b">Start Date</th>
                  <th className="p-4 border-b">Active</th>
                </tr>
              </thead>
              <tbody>
                {managerData.map((manager, index) => (
                  <tr key={manager.id} className="hover:bg-gray-50">
                    <td className="p-4 border-b">{index + 1}</td>
                    <td
                      className="p-4 border-b font-bold cursor-pointer hover:underline"
                      onClick={() => navigate(`/admin/manage-managers/${manager.id}`)}
                    >
                      {manager.userVM.fullName}
                    </td>
                    <td className="p-4 border-b">{manager.userVM.email}</td>
                    <td className="p-4 border-b">{manager.userVM.phoneNumber}</td>
                    <td className="p-4 border-b">
                      {new Date(manager.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 border-b">
                      {manager.isActive ? (
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
    </div>
  );
};

export default ListAllManagers;
