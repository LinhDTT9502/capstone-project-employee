import React, { useState, useEffect } from "react";
import { fetchBranchs } from "../../services/branchService";
import { fetchAllManagers } from "../../services/Manager/ManagerService";
import { createStaff, fetchAllStaffWithoutBranch } from "../../services/Staff/StaffService";
import { toast } from "react-toastify";

const CreateStaffModal = ({ onClose }) => {
  const [branches, setBranches] = useState([]);
  const [managers, setManagers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    const fetchBranches = async () => {
      const fetchedBranchs = await fetchBranchs();
      setBranches(fetchedBranchs || []);
    };

    const fetchStaffs = async () => {
      const data = await fetchAllStaffWithoutBranch();
      setUsers(data);
    };

    fetchBranches();
    fetchStaffs();
  }, []);

  const handleBranchChange = (branchId) => {
    setSelectedBranch(branchId);
    // Fetch managers based on selected branch
    const fetchManagers = async () => {
      const data = await fetchAllManagers();
      const filteredManagers = data.filter((m) => m.branchId === branchId);
      setManagers(filteredManagers);
    };

    fetchManagers();
  };

  const handleSubmit = async () => {
    const newStaff = {
      userId: selectedUser,
      branchId: selectedBranch,
      managerId: selectedManager || null,
      startDate,
      position,
    };

    const data = await createStaff(newStaff)
    if (data.isSuccess) {
      toast.success('Tạo nhân viên mới thành công!')
      onClose(true);
    } else {
      toast.error("Failed to create staff");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md">
        <h2 className="text-xl font-bold mb-4">Tạo nhân viên mới</h2>
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
        {managers.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium">Quản lý</label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) => setSelectedManager(Number(e.target.value))}
            >
              <option value="">Chọn quản lý</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.userVM.fullName}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium">Nhân viên</label>
          <select
            className="w-full p-2 border rounded"
            onChange={(e) => setSelectedUser(Number(e.target.value))}
          >
            <option value="">Chọn nhân viên</option>
            {users.length>0 ? (
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName}
                </option>
              ))) : (<option>
              Chưa có nhân viên mới
              </option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Vị trí làm việc</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
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
        <div className="flex justify-end">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-gray-300 rounded mr-2"
          >
            Đóng
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Tạo mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateStaffModal;
