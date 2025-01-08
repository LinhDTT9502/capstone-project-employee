// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";

import { fetchOrders } from "../../services/DashboardService";
import { selectUser } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";

import PieChart from "../../components/Chart/PieChart";
import BarChart from "../../components/Chart/BarChart";
import { getOrderbyBranch } from "../../services/Staff/OrderService";
import { fetchBranchs, getBranchs } from "../../services/branchService";
import { getRentalbyBranch } from "../../services/Staff/RentalService";

export default function Dashboard() {
  // const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeAmount, setActiveAmount] = useState(0);
  const [completedAmount, setCompletedAmount] = useState(0);
  const [activeLength, setActiveLength] = useState(0);
  const [completedLength, setCompletedLength] = useState(0);
  const [orders, setOrders] = useState([]);
  const [rentalOrders, setRentalOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [searchTerm, setSearchTerm] = useState('');
  const ordersPerPage = 10;
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [orderType, setOrderType] = useState(1);

  const user = useSelector(selectUser);

  const statusStyles = {
    "Đã hủy": 'bg-red-100 text-red-600',
    "Chờ xử lý": 'bg-yellow-100 text-yellow-600',
    "Đã xác nhận": 'bg-blue-100 text-blue-600',
    "Đã giao hàng": 'bg-green-100 text-green-600',
    "Đang xử lý": 'bg-indigo-100 text-indigo-600',
    "Đã giao cho đơn vị vận chuyển": 'bg-teal-100 text-teal-600',
    "Đã hoàn tiền": 'bg-orange-100 text-orange-600',
    "Đã hoàn thành": 'bg-green-100 text-green-600',
    "Đang xử lý hoàn tiền": 'bg-orange-100 text-orange-600',
    "Đã từ chối": 'bg-red-100 text-red-600',
  };

  const paymentStyles = {
    "Đã hủy": 'bg-red-100 text-red-600',
    "Đang chờ thanh toán": 'bg-yellow-100 text-yellow-600',
    "Đã thanh toán": 'bg-blue-100 text-blue-600',
    "Đã giao hàng": 'bg-green-100 text-green-600'
  };

  let totalSaleOrderPages = 0
  let totalRentalOrderPages = 0

  if (orders !== null) {
    totalSaleOrderPages = Math.ceil(orders.length / ordersPerPage);
  }

  if (rentalOrders !== null) {
    totalRentalOrderPages = Math.ceil(rentalOrders.length / ordersPerPage);
  }


  const handleSaleOrderPageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalSaleOrderPages) {
      setCurrentPage(newPage);
    }
  };

  const handleRentalOrderPageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalRentalOrderPages) {
      setCurrentPage(newPage);
    }
  };

  const fetchBranches = async () => {
    try {
      const data = await getBranchs();

      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setError('Failed to fetch branches');
    }
  };

  const fetchSaleOrderByBranch = async (branchId) => {
    try {
      console.log(branchId);

      const data = await getOrderbyBranch(branchId);

      // Sort the data by createdAt in descending order
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Simulate a delay for a better user experience
      setTimeout(() => {
        setOrders(sortedData);
        setCurrentPage(1);
      }, 5000); // Adjust delay as needed (in milliseconds)
    } catch (error) {
      console.error("Không thể lấy dữ liệu đơn hàng theo chi nhánh!", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRentalOrderByBranch = async (branchId) => {
    try {
      const data = await getRentalbyBranch(branchId);

      // Sort the data by createdAt in descending order
      const sortedData = data.sort((a, b) => new Date(b.rentalStartDate) - new Date(a.rentalStartDate));

      // Simulate a delay for a better user experience
      setTimeout(() => {
        setRentalOrders(sortedData); // Use the sorted data
        setCurrentPage(1);
      }, 5000); // Adjust delay as needed (in milliseconds)
    } catch (error) {
      console.error("Không thể lấy dữ liệu đơn thuê theo chi nhánh!", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSaleOrderByBranch(selectedBranch);
    fetchRentalOrderByBranch(selectedBranch);
    fetchBranches();
  }, [selectedBranch]);

  useEffect(() => {
    if (branches.length > 0 && selectedBranch === null) {
      const firstBranchId = branches[0].id;
      setSelectedBranch(firstBranchId);
      fetchSaleOrderByBranch(firstBranchId); // Fetch data for the first branch
      fetchRentalOrderByBranch(firstBranchId); // Fetch data for the first branch
    }
  }, [branches]); // Run this effect whenever the branches array changes

  const handleBranchSelect = async (branchId) => {
    setSelectedBranch(branchId);
    setOrders(null)
    setRentalOrders(null)
    setLoading(true)
  };
  console.log(selectedBranch);


  const handleSortChange = (e) => {
    const selectedSortOrder = e.target.value;
    setSortOrder(selectedSortOrder);

    const sortedOrders = [...orders].sort((a, b) => {
      if (selectedSortOrder === 'earliest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setOrders(sortedOrders);
  };

  const formatPrice = (value) => {
    return (
      new Intl.NumberFormat("en-US", { minimumFractionDigits: 0 }).format(
        value
      ) + " ₫"
    );
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <p className="mt-4 text-lg font-semibold text-gray-700">Đang tải...</p>
    </div>
  ); if (error) return <p className="text-center py-4 text-red-500">{error}</p>;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const ordersData = await fetchOrders();
  //       setOrders(ordersData);
  //       // console.log(`${t("dashboard.orders")}`, ordersData);

  //       // Calculate totals
  //       const totalOrdersCount = ordersData.length;
  //       const totalAmountSum = ordersData.reduce((acc, order) => acc + parseFloat(order.amount), 0);
  //       setTotalOrders(totalOrdersCount);
  //       setTotalAmount(totalAmountSum);
  //       toast.success("Orders fetched successfully");
  //     } catch (error) {
  //       console.log(error);
  //       setOrders([]);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const onSelectChange = (selectedKey) => {
  //   setSelectedRowKeys((prevSelectedRowKeys) =>
  //     prevSelectedRowKeys.includes(selectedKey)
  //       ? prevSelectedRowKeys.filter((key) => key !== selectedKey)
  //       : [...prevSelectedRowKeys, selectedKey]
  //   );
  // };
  // comment tạm

  return (
    <>
      <h2 className="text-2xl font-bold mx-10 mt-4">Thống kê dữ liệu</h2>

      <hr className="mb-8 flex justify-between items-center mx-10 my-4" />
      <div className="mx-10 flex space-x-2">
        <div className="w-1/2">
          <BarChart
            branchId={selectedBranch}
          />
        </div>
        <div className="w-1/2">
          <PieChart
            branchId={selectedBranch}
          />
        </div>

      </div>
      <hr className="mb-8 flex justify-between items-center mx-10 my-4" />
      {/* <RecentOrder/> */}

<div className="mx-10">
      <div className="flex items-center justify-between my-2 ">
        <div className="flex gap-1 p-1 bg-gray-200 rounded-full w-fit transition-all duration-300">
          <button
            onClick={() => setOrderType(1)}
            className={`cursor-pointer w-24 py-2 rounded-full text-center transition-all duration-300 ease-in-out ${orderType === 1
              ? "bg-green-500 text-white shadow-md"
              : "bg-transparent text-black hover:bg-gray-300"
              }`}>
            Đơn mua
          </button>
          <button
            onClick={() => setOrderType(2)}
            className={`cursor-pointer w-24 py-2 rounded-full text-center transition-all duration-300 ease-in-out ${orderType === 2
              ? "bg-blue-500 text-white shadow-md"
              : "bg-transparent text-black hover:bg-gray-300"
              }`}>
            Đơn thuê
          </button>
        </div>
        {/* <div className="flex items-center gap-4">
          <select
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-400 w-full"
            onChange={handleSortChange}
            value={sortOrder}
          >
            <option value="latest">Đơn mới nhất</option>
            <option value="earliest">Đơn cũ nhất</option>
          </select>
        </div> */}
      </div>

      <div>
        {/* Filter Tabs */}
        <div className="flex space-x-4 border-b p-2">
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => handleBranchSelect(branch.id)}
              className={`px-4 py-2 ${selectedBranch === branch.id ? "bg-orange-500 text-white" : "bg-gray-200"
                } rounded`}
            >
              {branch.branchName.split("2Sport ").pop()}
            </button>

          ))}

        </div>
      </div>

      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        {orderType === 1 ? (
          <>
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">Mã đơn hàng</th>
                <th className="text-left p-4 font-semibold text-gray-600">Khách hàng</th>
                <th className="text-left p-4 font-semibold text-gray-600">Ngày đặt hàng</th>
                <th className="text-left p-4 font-semibold text-gray-600">TT thanh toán</th>
                <th className="text-left p-4 font-semibold text-gray-600">TT đơn hàng</th>
                <th className="text-left p-4 font-semibold text-gray-600"></th>
              </tr>
            </thead>
            {loading ? (
              <div className="w-full m-auto flex justify-center items-center h-full text-gray-500 mt-4 font-bold">
                Đang tải dữ liệu...
              </div>
            ) : (orders && orders.length > 0 ? (
              <tbody>
                {orders
                  .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
                  .map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4">{order.saleOrderCode}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">{order.fullName}</span>
                          <span className="text-sm text-gray-500">{order.email}</span>
                        </div>
                      </td>
                      <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStyles[order.paymentStatus] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.orderStatus] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            ) : (
              <div className="w-full m-auto flex justify-center items-center h-full text-gray-500 mt-4 font-bold">
                Hiện tại không có đơn hàng nào cả
              </div>
            ))}
          </>
        ) : (
          <>
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-600">Mã đơn hàng</th>
                <th className="text-left p-4 font-semibold text-gray-600">Khách hàng</th>
                <th className="text-left p-4 font-semibold text-gray-600">Ngày bắt đầu thuê</th>
                <th className="text-left p-4 font-semibold text-gray-600">Ngày kết thúc thuê</th>
                <th className="text-left p-4 font-semibold text-gray-600">Số ngày thuê</th>
                <th className="text-left p-4 font-semibold text-gray-600">TT thanh toán</th>
                <th className="text-left p-4 font-semibold text-gray-600">TT đơn hàng</th>
                <th className="text-left p-4 font-semibold text-gray-600"></th>
              </tr>
            </thead>
            {loading ? (
              <div className="w-full m-auto flex justify-center items-center h-full text-gray-500 mt-4 font-bold">
                Đang tải dữ liệu...
              </div>
            ) : rentalOrders && rentalOrders.length > 0 ? (
              <tbody>
                {rentalOrders
                  .slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)
                  .map((rentalOrder) => (
                    <tr key={rentalOrder.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="p-4">{rentalOrder.saleOrderCode}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-700">{rentalOrder.fullName}</span>
                          <span className="text-sm text-gray-500">{rentalOrder.email}</span>
                        </div>
                      </td>
                      <td className="p-4">{new Date(rentalOrder.rentalStartDate).toLocaleDateString()}</td>
                      <td className="p-4">{new Date(rentalOrder.rentalEndDate).toLocaleDateString()}</td>
                      {/* Fix: Display rentalDays directly if it's a number */}
                      <td className="p-4">{rentalOrder.rentalDays}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStyles[rentalOrder.paymentStatus] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {rentalOrder.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[rentalOrder.orderStatus] || 'bg-gray-100 text-gray-600'}`}
                        >
                          {rentalOrder.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            ) : (
              <div className="w-full m-auto flex justify-center items-center h-full text-gray-500 mt-4 font-bold">
                Hiện tại không có đơn hàng nào cả
              </div>
            )}
          </>
        )}
      </table>
</div>



    </>
  );
}
