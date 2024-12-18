// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  Card,
  Breadcrumbs,
  CardBody,
  Typography,
  Avatar,
  Checkbox,
} from "@material-tailwind/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faArrowUp,
  faCalendar,
  faBagShopping,
} from "@fortawesome/free-solid-svg-icons";
import { fetchOrders } from "../../services/DashboardService";
import { selectUser } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import RecentOrder from "./RecentOrder";
import HeaderStaff from "../../layouts/HeaderStaff";
import SidebarStaff from "../../layouts/SidebarStaff";
import PieChart from "../../components/Chart/PieChart";
import BarChart from "../../components/Chart/BarChart";

export default function Dashboard() {
  // const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeAmount, setActiveAmount] = useState(0);
  const [completedAmount, setCompletedAmount] = useState(0);
  const [activeLength, setActiveLength] = useState(0);
  const [completedLength, setCompletedLength] = useState(0);
  const user = useSelector(selectUser);

  const formatPrice = (value) => {
    return (
      new Intl.NumberFormat("en-US", { minimumFractionDigits: 0 }).format(
        value
      ) + " VND"
    );
  };

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
      <div className="mx-10  space-x-2">
        <div className="w-full">
          <PieChart />
        </div>
        <div className="w-full">
          <BarChart />
        </div>

      </div>
      {/* <RecentOrder/> */}
    </>
  );
}
