import React, { useState, useEffect } from "react";
import { Typography, Card, Spinner } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchAllUsers,
  createUser,
  removeUser,
  editUser,
} from "../../services/ManageUserService";
import UserActions from "../../components/Admin/UserActions";
import AddUserModal from "../../components/Admin/AddUserModal";
import EditUserModal from "../../components/Admin/EditUserModal";

const ManageUser2 = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchAllUsers();
      setUsers(response);
    } catch (err) {
      setError("Đã xảy ra lỗi khi lấy dữ liệu người dùng.");
      toast.error("Không thể lấy dữ liệu người dùng!", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user handler
  const handleAddUser = async (formData) => {
    try {
      await createUser(formData);
      await fetchUsers();
      setIsAddModalOpen(false);
      toast.success("Thêm người dùng thành công!");
    } catch (error) {
      console.error(
        "Lỗi khi thêm người dùng:",
        error.response?.data || error.message || error
      );
      toast.error("Thêm người dùng thất bại! Vui lòng kiểm tra dữ liệu nhập.");
    }
  };

  // Edit user handler
  const handleEditUser = async (userId, updatedData) => {
    try {
      const response = await editUser(userId, updatedData);
      if (response.isSuccess) {
        fetchUsers();
        toast.success("Cập nhật người dùng thành công!");
      } else {
        toast.error("Cập nhật người dùng thất bại!");
      }
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Lỗi xảy ra khi cập nhật người dùng.");
      console.error("Error updating user:", error);
    }
  };

  // Delete user handler
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        const response = await removeUser(userId);
        if (response.isSuccess) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
          );
          toast.success("Người dùng đã được xóa thành công!");
        } else {
          toast.error("Xóa người dùng thất bại!");
        }
      } catch (error) {
        toast.error("Lỗi xảy ra khi xóa người dùng.");
        console.error("Error deleting user:", error);
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
      <div className="container mx-auto p-4">
        <Card className="shadow-lg">
          <div className="flex justify-between items-center p-4">
            <Typography variant="h4" color="blue-gray">
              Quản lý Người Dùng
            </Typography>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded shadow"
              onClick={() => setIsAddModalOpen(true)}
            >
              Thêm Người Dùng
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
                    <th className="p-4 border-b">Tên Người Dùng</th>
                    <th className="p-4 border-b">Email</th>
                    <th className="p-4 border-b">Vai Trò</th>
                    <th className="p-4 border-b">Hành Động</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b">{index + 1}</td>
                      <td className="p-4 border-b">{user.fullName}</td>
                      <td className="p-4 border-b">{user.email}</td>
                      <td className="p-4 border-b">{user.roleId}</td>
                      <td className="p-4 border-b">
                        <UserActions
                          user={user}
                          onEdit={() => {
                            setSelectedUser(user);
                            setIsEditModalOpen(true);
                          }}
                          onDelete={() => handleDeleteUser(user.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Add User Modal */}
        {isAddModalOpen && (
          <AddUserModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddUser={handleAddUser}
          />
        )}

        {/* Edit User Modal */}
        {isEditModalOpen && selectedUser && (
           <EditUserModal
           isOpen={isEditModalOpen}
           onClose={() => setIsEditModalOpen(false)}
           onEditUser={handleEditUser} 
           user={selectedUser} 
         />
        )}
      </div>
    </>
  );
};

export default ManageUser2;
