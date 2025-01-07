import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { updateRefund } from "../../services/Staff/RefundService";
import { getRentalDetail } from "../../services/Staff/RentalService";
import { getOrderbyCode } from "../../services/Staff/OrderService";

const UpdateRefundModal = ({ open, onClose, orderCode, rentalCode, id }) => {
  const user = useSelector(selectUser);
  const [staffNotes, setStaffNotes] = useState("");
  const [status, setStatus] = useState("");
  const [refundMethod, setRefundMethod] = useState("");
  const token = localStorage.getItem("token");

  const handleUpdateRefund = async () => {
    let refundAmount = 0;
    try {
      if (orderCode) {
        const orderData = await getOrderbyCode(orderCode)
        refundAmount = orderData.totalAmount
      } else if (rentalCode) {
        const response = await getRentalDetail(rentalCode);
        refundAmount = response.data.totalAmount
      }
      const data = {
        refundRequestId: id,
        refundAmount: refundAmount,
        refundMethod: refundMethod,
        paymentGatewayTransactionID: null,
        processedBy: user.StaffId,
        staffName: user.FullName,
        staffNotes: staffNotes,
        status: status
      };
      console.log(data);


      const response = await updateRefund(data, token);
      console.log("Refund updated successfully:", response);
      onClose(); // Close modal on successful update
    } catch (error) {
      console.error("Error during refund update:", error);
    }
  };

  useEffect(() => {
    if (open) {
      setStaffNotes("");
      setStatus("");
      setRefundMethod("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="lg">
      <DialogHeader>Cập nhật hoàn tiền cho đơn #{orderCode}</DialogHeader>
      <DialogBody divider className="max-h-[70vh] overflow-y-auto">
        <div className="flex flex-col gap-4">
          {/* Staff Notes Input */}
          <Textarea
            label="Ghi chú từ nhân viên"
            value={staffNotes}
            onChange={(e) => setStaffNotes(e.target.value)}
            className="w-full"
          />

          {/* Status Select */}
          <Select
            label="Chọn trạng thái hoàn tiền"
            value={status}
            onChange={(value) => setStatus(value)}
          >
            <Option value="Pending">Chờ xử lý</Option>
            <Option value="Approved">Chấp nhận yêu cầu</Option>
            <Option value="Rejected">Từ chối yêu cầu</Option>
          </Select>

          {/* Refund Method (optional) */}
          <Input
            label="Phương pháp hoàn tiền"
            value={refundMethod}
            onChange={(e) => setRefundMethod(e.target.value)}
            placeholder="Nhập phương thức hoàn tiền (Không bắt buộc)"
            className="w-full"
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button color="red" onClick={onClose} className="mr-2">
          Đóng
        </Button>
        <Button color="green" onClick={handleUpdateRefund}>
          Hoàn tất yêu cầu
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default UpdateRefundModal;
