import React, { useEffect, useState } from "react";
import { Typography, Chip, Spinner, Button } from "@material-tailwind/react";
import { approveExtension, fetchListExtension } from "../../services/Staff/RentalService";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";

const ListExtension = () => {
  const [extensionRequests, setExtensionRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [extensionStatus, setExtensionStatus] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const user = useSelector(selectUser);

  // Chip filter options
  const statusChips = [
    { label: "Tất cả", value: 0, color: "blue" },
    { label: "Đang xử lý", value: 1, color: "yellow" },
    { label: "Chấp thuận", value: 2, color: "green" },
    { label: "Từ chối", value: 3, color: "red" },
  ];

  // Fetch extension requests
  const fetchExtensions = async () => {
    try {
      setLoading(true);
      const data = await fetchListExtension(extensionStatus, user.BranchId);
      const reversedRequests = data.data?.$values?.slice().reverse() || [];
      setExtensionRequests(reversedRequests);
      setFilteredRequests(reversedRequests);
    } catch (error) {
      console.error("Error fetching extensions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExtensions();
  }, [extensionStatus]);

  // Filter requests based on search term
  useEffect(() => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    const filtered = extensionRequests.filter(
      (request) =>
        request.fullName?.toLowerCase().includes(lowerCaseTerm) ||
        request.rentalOrderCode?.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset to the first page when filtering
  }, [searchTerm, extensionRequests]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Approve extension handler
  const handleApprove = async (rentalOrderCode) => {
    try {
      await approveExtension(rentalOrderCode);
      fetchExtensions();
    } catch (error) {
      console.error("Error approving extension:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="shadow-lg bg-white p-6 rounded-lg">
        {/* Title */}
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold text-blue-gray-800">
            Yêu cầu <span className="text-orange-500">Gia hạn</span> ({filteredRequests.length})
          </Typography>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên..."
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Chips */}
        <div className="flex flex-wrap gap-4 mb-4">
          {statusChips.map((chip) => (
            <Chip
              key={chip.value}
              value={chip.label}
              variant={extensionStatus === chip.value ? "filled" : "outlined"}
              color={chip.color}
              onClick={() => setExtensionStatus(chip.value)}
              className="cursor-pointer"
            />
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center p-6">
            <Spinner className="h-10 w-10" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">#</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Mã đơn hàng</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Khách hàng</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Sản phẩm</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Ngày bắt đầu</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Ngày kết thúc</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Giá thuê</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm">Trạng thái</th>
                  <th className="p-4 border-b text-left text-gray-700 text-sm"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((request, index) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="p-4 border-b text-sm text-gray-700">{indexOfFirstItem + index + 1}</td>
                      <td className="p-4 border-b text-sm text-gray-700">{request.rentalOrderCode}</td>
                      <td className="p-4 border-b text-sm text-gray-700">
                        {request.fullName}
                        <br />
                        <span className="text-xs text-gray-500">{request.email}</span>
                      </td>
                      <td className="p-4 border-b text-sm text-gray-700">
                        <div className="flex items-center gap-4">
                          <img
                            src={request.imgAvatarPath}
                            alt={request.productName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div>
                            {request.productName}
                            <br />
                            <span className="text-xs text-gray-500">Code: {request.productCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 border-b text-sm text-gray-700">
                        {new Date(request.rentalStartDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="p-4 border-b text-sm text-gray-700">
                        {new Date(request.rentalEndDate).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="p-4 border-b text-sm text-gray-700">
                        {request.rentPrice.toLocaleString("vi-VN")} ₫
                      </td>
                      <td className="p-4 border-b text-sm text-gray-700">
                        {statusChips.find((chip) => chip.value === extensionStatus)?.label || "Không xác định"}
                      </td>
                      <td className="p-4 border-b text-sm">
                        {extensionStatus === 1 && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-green-500 text-white"
                              onClick={() => handleApprove(request.rentalOrderCode)}
                            >
                              Chấp nhận
                            </Button>
                            <Button size="sm" className="bg-red-500 text-white">
                              Từ chối
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="p-4 text-center text-gray-700">
                      Không có yêu cầu gia hạn nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => handlePageChange(number + 1)}
              className={`px-3 py-1 mx-1 border rounded ${
                currentPage === number + 1 ? "bg-black text-white" : "bg-gray-200"
              }`}
            >
              {number + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListExtension;
