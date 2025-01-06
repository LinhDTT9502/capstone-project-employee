import React, { useState, useEffect } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { fetchBranchs } from "../../services/branchService";
import { editManager, fetchAllManagers } from "../../services/Manager/ManagerService";
import { toast } from "react-toastify";

const EditManagerModal = ({ isOpen, onClose, manager, setIsReload }) => {
    const [branches, setBranches] = useState([]);
    const [branchId, setBranchId] = useState(0);
    const [managers, setManagers] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [position, setPosition] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchBranches = async () => {
        const fetchedBranchs = await fetchBranchs();
        setBranches(fetchedBranchs || []);
    };

    useEffect(() => {
        if (manager) {
            console.log(manager);

            setBranchId(manager.branchId || 0);
            setStartDate(manager.startDate ? manager.startDate.split("T")[0] : "");
            setEndDate(manager.endDate ? manager.endDate.split("T")[0] : "");
            setIsActive(manager.isActive ?? true);
            // console.log(manager);
            if (manager.branchId) {
                handleBranchChange(manager.branchId);
            }
        }

        fetchBranches();
    }, [manager]);

    const handleSubmit = async () => {
        const updatedManager = {
            managerId: manager.id,
            userId: manager.userId,
            branchId: branchId === 0 ? null : parseInt(branchId, 10),
            startDate,
            endDate: endDate === "" ? null : endDate,
        };
        console.log(updatedManager)
        try {
            setLoading(true)
            console.log(updatedManager)
            await editManager(updatedManager);
            toast.success("Quản lý được cập nhật thành công!", {
                position: "top-right",
            });
        } catch (error) {
            toast.error("Cập nhật Quản lý thất bại!", { position: "top-right" });
        } finally {
            setLoading(false)
            setIsReload(true)
            onClose();
        }
    };
    const handleBranchChange = (branchId) => {
        setBranchId(branchId);

        const fetchManagers = async () => {
            const data = await fetchAllManagers();
            const filteredManagers = data.filter((m) => m.branchId === branchId);
            setManagers(filteredManagers);
        };
        fetchManagers();
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="sm" className="bg-white shadow-none">
            {loading && (
                <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
                    <span className="text-white ml-4">Đang xử lý...</span>
                </div>
            )}
            <DialogHeader className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa Thông Tin Quản Lý</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </DialogHeader>
            <DialogBody divider>
                <div className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Chi nhánh</label>
                        <select
                            className="w-full p-2 border rounded"
                            value={branchId || ""} // Hiển thị branch hiện tại
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
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Ngày Bắt Đầu
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            Ngày Kết Thúc
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </DialogBody>
            <DialogFooter className="space-x-2">
                <button
                    onClick={onClose}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSubmit}
                    className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <FontAwesomeIcon icon={faSave} />
                    Lưu
                </button>
            </DialogFooter>
        </Dialog>
    );
};

export default EditManagerModal;
