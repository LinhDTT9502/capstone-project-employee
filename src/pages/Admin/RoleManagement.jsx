import React, { useEffect, useState } from "react";
import { Typography, Card, Spinner } from "@material-tailwind/react";
import { fetchRoles, createRole, updateRole, deleteRole } from "../../services/roleService";
import RoleActions from "../../components/Admin/RoleActions.jsx";
import AddRoleModal from "../../components/Admin/AddRoleModal.jsx";
import EditRoleModal from "../../components/Admin/EditRoleModal.jsx";
import { ToastContainer, toast } from "react-toastify";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Fetch all roles
  const fetchRoleData = async () => {
    try {
        setLoading(true);
      const response = await fetchRoles();
      setRoles(response);
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy dữ liệu.");
      toast.error("Không thể lấy dữ liệu vai trò!", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoleData();
  }, []);

  // Add role handler
  const handleAddRole = async (roleData) => {
    try {
      await createRole(roleData);
      fetchRoleData(); 
      toast.success("Thêm vai trò thành công!", { position: "top-right" });
    } catch (error) {
        toast.error("Thêm vai trò thất bại!", { position: "top-right" });
      console.error("Error adding role:", error);
    }
  };

  // Edit role handler
  const handleEditRole = async (roleId, updatedData) => {
    try {
      await updateRole(roleId, updatedData);
      fetchRoleData(); toast.success("Cập nhật vai trò thành công!", { position: "top-right" });
    } catch (error) { toast.error("Cập nhật vai trò thất bại!", { position: "top-right" });
      console.error("Error editing role:", error);
    }
  };

  // Delete role handler
  const handleDeleteRole = async (roleId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa vai trò này không?")) {
      try {
        await deleteRole(roleId);
        setRoles((prevRoles) => prevRoles.filter((role) => role.roleId !== roleId));
        toast.success("Vai trò đã được xóa!", { position: "top-right" });
      } catch (error) {
        toast.error("Xóa vai trò thất bại!", { position: "top-right" });
        console.error("Error deleting role:", error);
      }
    }
  };

  return (
    <><ToastContainer />
    <div className="container mx-auto p-4">
       <Card className="shadow-lg">
          <div className="flex justify-between items-center p-4">
            <Typography variant="h4" color="blue-gray">
              Quản lý vai trò
            </Typography>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow"
              onClick={() => setIsAddModalOpen(true)}
            >
              Tạo mới
            </button>
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
                  <th className="p-4 border-b">Tên vai trò</th>
                  <th className="p-4 border-b">Mô tả</th>
                  <th className="p-4 border-b">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => (
                  <tr key={role.roleId} className="hover:bg-gray-50">
                    <td className="p-4 border-b">{index + 1}</td>
                    <td className="p-4 border-b">{role.roleName}</td>
                    <td className="p-4 border-b">{role.description}</td>
                    <td className="p-4 border-b">
                      <RoleActions
                        role={role}
                        onEdit={() => {
                          setSelectedRole(role);
                          setIsEditModalOpen(true);
                        }}
                        onDelete={() => handleDeleteRole(role.roleId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add Role Modal */}
      {isAddModalOpen && (
        <AddRoleModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddRole={handleAddRole}
        />
      )}

      {/* Edit Role Modal */}
      {isEditModalOpen && selectedRole && (
        <EditRoleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEditRole={handleEditRole}
          role={selectedRole}
        />
      )}
    </div></>
  );
};

export default RoleManagement;
