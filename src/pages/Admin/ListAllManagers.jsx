import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Typography,
  Spinner,
  Button,
  Switch,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { fetchAllManagers } from "../../services/Manager/ManagerService";

const ListAllManagers = () => {
  const [managerData, setManagerData] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]); // State for filtered managers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const navigate = useNavigate();

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllManagers();

      if (response) {
        setManagerData(response);
        setFilteredManagers(response); // Initialize filtered managers
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

  // Filter managers based on the search term
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = managerData.filter(
      (manager) =>
        manager.userVM.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        manager.userVM.email?.toLowerCase().includes(lowerCaseSearchTerm) ||
        manager.userVM.phoneNumber?.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredManagers(filtered);
  }, [searchTerm, managerData]);

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <div className="flex justify-between items-center p-4">
          <Typography
            variant="h4"
            color="blue-gray"
            className="p-4 text-center"
          >
            Danh sách <span className="text-orange-500">[Quản Lý]</span> ({filteredManagers.length})
          </Typography>
          <Button onClick={() => setIsModalOpen(true)}>
          <FontAwesomeIcon icon={faPlus} />{" "}
            Tạo mới
            </Button>
        </div>

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
                  <th className="p-4 border-b">Tên quản lý</th>
                  <th className="p-4 border-b">Email</th>
                  <th className="p-4 border-b">Chi nhánh</th>
                  <th className="p-4 border-b">Ngày bắt đầu</th>
                  <th className="p-4 border-b">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {filteredManagers.map((manager, index) => (
                  <tr key={manager.id} className="hover:bg-gray-50">
                    <td className="p-4 border-b">{index + 1}</td>
                    <td
                      className="p-4 border-b font-bold cursor-pointer hover:underline"
                      onClick={() =>
                        navigate(`/admin/manage-managers/${manager.id}`)
                      }
                    >
                      {manager.userVM.fullName}
                    </td>
                    <td className="p-4 border-b">{manager.userVM.email}</td>
                    <td className="p-4 border-b">{manager.branchName}</td>
                    <td className="p-4 border-b">
                      {new Date(manager.startDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4 border-b">
                      <Switch
                        color="green"
                        checked={manager.isActive}
                      />
                      {/* {manager.isActive ? (
                        <span className="text-green-600 font-semibold">
                          Hoạt động
                        </span>
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
    </div>
  );
};

export default ListAllManagers;
