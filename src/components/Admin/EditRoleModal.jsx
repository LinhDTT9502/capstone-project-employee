import React, { useState, useEffect } from "react";
import { Dialog } from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSave } from "@fortawesome/free-solid-svg-icons";

const EditRoleModal = ({ isOpen, onClose, onEditRole, role }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (role) {
      setRoleName(role.roleName);
      setDescription(role.description);
    }
  }, [role]);

  const handleSubmit = () => {
    onEditRole(role.roleId, { roleName, description });
    onClose();
  };

  return (
    <Dialog open={isOpen} handler={onClose} size="sm">
      <div className="relative rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa vai trò</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          {/* Role Name Input */}
          <div className="mb-4">
            <label htmlFor="roleName" className="block text-sm font-medium text-gray-700">
              Tên vai trò
            </label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* Description Input */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Mô tả
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FontAwesomeIcon icon={faSave} />
              Lưu
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EditRoleModal;
