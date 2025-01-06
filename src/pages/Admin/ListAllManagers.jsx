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
import ManagerActions from "../../components/Admin/ManagerActions";
import AddManagerModal from "../../components/Admin/AddManagerModal";
import EditManagerModal from "../../components/Admin/EditManagerModal";
import ConfirmDeleteManagerModal from "../../components/Admin/ConfirmDeleteManagerModal";

const ListAllManagers = () => {
  const [managerData, setManagerData] = useState([]);
  const [filteredManagers, setFilteredManagers] = useState([]); // State for filtered managers
  const [loading, setLoading] = useState(true);
  const [isReload, setIsReload] = useState(true);
  const [error, setError] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDeleteManagerModalOpen, setIsConfirmDeleteManagerModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllManagers();

      if (response) {
        // Sort the response data by startDate in descending order
        const sortedData = response.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

        setManagerData(sortedData);
        setFilteredManagers(sortedData); // Initialize filtered managers with sorted data
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
    setIsReload(false)
  }, [isReload]);

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
          <Button onClick={() => setIsAddModalOpen(true)}>
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
                  <th className="p-4 border-b">Ngày kết thúc</th>
                  <th className="p-4 border-b"></th>
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
                      {manager.endDate
                        ? new Date(manager.endDate).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        : ""}
                    </td>
                    <td className="p-4 border-b">
                      <ManagerActions
                        manager={manager}
                        onEdit={() => {
                          setSelectedManager(manager);
                          setIsEditModalOpen(true);
                        }}
                        onDelete={() => {
                          setSelectedManager(manager);
                          setIsConfirmDeleteManagerModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Manager Modal */}
      {isAddModalOpen && (
        <AddManagerModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          setIsReload={setIsReload}
        />
      )}

      {/* Edit Manager Modal */}
      {isEditModalOpen && selectedManager && (
        <EditManagerModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          manager={selectedManager}
          setIsReload={setIsReload}
        />
      )}

      {/* Delete Manager Modal */}
      {isConfirmDeleteManagerModalOpen && selectedManager && (
        <ConfirmDeleteManagerModal
          isOpen={isConfirmDeleteManagerModalOpen}
          onClose={() => setIsConfirmDeleteManagerModalOpen(false)}
          manager={selectedManager}
          setIsReload={setIsReload}
        />
      )}
    </div>


  );
};

export default ListAllManagers;
