import React, { useEffect, useState } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { fetchAllManagers } from "../../services/Manager/ManagerService";
import { createStaff, fetchAllStaffWithoutBranch } from "../../services/Staff/StaffService";
import { fetchBranchs } from "../../services/branchService";

const AddStaffModal = ({ isOpen, onClose, setIsReload }) => {
  const [managers, setManagers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [position, setPosition] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token")

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
    // if (!staffName.trim() || !uploadFile) {
    //   setErrors({
    //     staffName: !staffName.trim() ? "Vui lòng nhập tên nhân viên" : "",
    //     staffImage: !uploadFile ? "Hình ảnh là bắt buộc." : "",
    //   });
    //   return;
    // }

    const newStaff = {
      userId: selectedUser,
      branchId: selectedBranch,
      managerId: selectedManager || null,
      startDate,
      endDate,
      position,
    };
    setLoading(true)
    try {
      const data = await createStaff(newStaff)
      if (data.isSuccess) {
        toast.success('Tạo nhân viên mới thành công!')
      } else {
        toast.error("Tạo nhân viên thất bại.");
      }
    } catch (error) {
      toast.error("Tạo nhân viên thất bại.", { position: "top-right" });
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
              {users.length > 0 ? (
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
          <div className="mb-4">
            <label className="block text-sm font-medium">Ngày kết thúc</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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

export default AddStaffModal;
