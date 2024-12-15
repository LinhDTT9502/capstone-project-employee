import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Typography, Button } from "@material-tailwind/react";

const ViewUserModal = ({ isOpen, onClose, user }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} size="lg">
      <DialogHeader>Chi Tiết Tài Khoản</DialogHeader>
      <DialogBody>
        <div>
          <Typography variant="small" className="font-semibold">
            Tên đăng nhập:
          </Typography>
          <Typography>{user?.userName || "Không có thông tin"}</Typography>
        </div>
        <div>
          <Typography variant="small" className="font-semibold">
            Email:
          </Typography>
          <Typography>{user?.email || "Không có thông tin"}</Typography>
        </div>
        <div>
          <Typography variant="small" className="font-semibold">
            Trạng thái:
          </Typography>
          <Typography>{user?.isActived ? "Hoạt động" : "Vô hiệu hóa"}</Typography>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ViewUserModal;
