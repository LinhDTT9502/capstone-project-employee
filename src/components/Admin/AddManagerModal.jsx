import React, { useEffect, useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { createManager, fetchAllManagerWithoutBranch } from "../../services/Manager/ManagerService";
import { fetchBranchs } from "../../services/branchService";

const AddManagerModal = ({ isOpen, onClose, setIsReload }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchBranches = async () => {
      const fetchedBranchs = await fetchBranchs();
      setBranches(fetchedBranchs || []);
    };

    const fetchManagers = async () => {
      const data = await fetchAllManagerWithoutBranch();
      setUsers(data);
    };

    fetchBranches();
    fetchManagers();
  }, []);

  const handleBranchChange = (branchId) => {
    setSelectedBranch(branchId);
  };

  const handleSubmit = async () => {
    // if (!managerName.trim() || !uploadFile) {
    //   setErrors({
    //     managerName: !managerName.trim() ? "Vui lòng nhập tên quản lý" : "",
    //     managerImage: !uploadFile ? "Hình ảnh là bắt buộc." : "",
    //   });
    //   return;
    // }

    const newManager = {
      userId: selectedUser,
      branchId: selectedBranch,
      managerId: selectedManager || null,
      startDate,
      endDate,
    };
    setLoading(true)
    try {
      const data = await createManager(newManager)
      if (data.isSuccess) {
        toast.success('Tạo quản lý mới thành công!')
      } else {
        toast.error("Tạo quản lý thất bại.");
      }
    } catch (error) {
      toast.error("Tạo quản lý thất bại.", { position: "top-right" });
    } finally {
      setIsReload(true)
      setLoading(false)
    }
    onClose()

    setErrors({});
  };


  return (
    <Dialog open={isOpen} handler={onClose}>
      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
          <span className="text-white ml-4">Đang xử lý...</span>
        </div>
      )}
      <div className=" fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="w-1/3 bg-white p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4">Tạo quản lý mới</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium">Chi nhánh</label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => handleBranchChange(Number(e.target.value))}
            >
              <option value="">Chọn chi nhánh</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Quản lý</label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => setSelectedUser(Number(e.target.value))}
            >
              <option value="">Chọn quản lý</option>
              {users.length > 0 ? (
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullName}
                  </option>
                ))) : (<option>
                  Chưa có quản lý mới
                </option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Ngày bắt đầu</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" />
              Thêm
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default AddManagerModal;
