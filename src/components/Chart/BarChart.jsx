import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader } from "@material-tailwind/react";
import Chart from "react-apexcharts";

const BarChart = ({ branchId }) => {
  const [chartData, setChartData] = useState({
    series: [
      { name: "Tổng số đơn đặt hàng (Bán)", data: [] },
      { name: "Tổng số đơn đặt hàng (Cho Thuê)", data: [] },
    ],
    categories: [
      "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12",
    ],
  });
  const [isDataAvailable, setIsDataAvailable] = useState(false); // Track data availability

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Sale Orders
        const saleResponse = await axios.get(
          `https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/get-orders-by-branch?branchId=${branchId}`
        );

        // Fetch Rental Orders
        const rentalResponse = await axios.get(
          `https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder/get-orders-by-branch?branchId=${branchId}`
        );

        if (saleResponse.data.data || rentalResponse.data.data) {
          const saleOrders = saleResponse.data.data?.$values || [];
          const rentalOrders = rentalResponse.data.data?.$values || [];

          // Initialize arrays for totals
          const totalSaleOrders = Array(12).fill(0);
          const totalRentalOrders = Array(12).fill(0);

          // Process Sale Orders
          saleOrders.forEach((order) => {
            const createdAt = new Date(order.createdAt);
            const month = createdAt.getMonth();
            totalSaleOrders[month] += 1;
          });

          // Process Rental Orders
          rentalOrders.forEach((order) => {
            const createdAt = new Date(order.createdAt);
            const month = createdAt.getMonth();
            totalRentalOrders[month] += 1;
          });

          const hasData =
            totalSaleOrders.some((count) => count > 0) ||
            totalRentalOrders.some((count) => count > 0);

          setIsDataAvailable(hasData); // Check if there's any data to display

          // Update chart data
          setChartData({
            series: [
              { name: "Tổng số đơn đặt hàng (Bán)", data: totalSaleOrders },
              { name: "Tổng số đơn đặt hàng (Cho Thuê)", data: totalRentalOrders },
            ],
            categories: [
              "T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "T10", "T11", "T12",
            ],
          });
        } else {
          setIsDataAvailable(false); // No data
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsDataAvailable(false); // Handle API failure
      }
    };

    fetchData();
  }, [branchId]);

  const chartConfig = {
    type: "bar",
    height: 240,
    series: isDataAvailable ? chartData.series : [], // No series if no data
    options: {
      chart: { toolbar: { show: false } },
      title: { show: false },
      dataLabels: { enabled: false },
      colors: ["#020617", "#FF6F00"], // Add distinct colors for both series
      plotOptions: {
        bar: { columnWidth: "40%", borderRadius: 2 },
      },
      xaxis: {
        axisTicks: { show: false },
        axisBorder: { show: false },
        labels: { style: { colors: "#616161", fontSize: "12px" } },
        categories: chartData.categories,
      },
      yaxis: {
        labels: { style: { colors: "#616161", fontSize: "12px" } },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: { lines: { show: true } },
        padding: { top: 5, right: 20 },
      },
      fill: { opacity: 0.8 },
      tooltip: { theme: "dark" },
    },
  };

  return (
    <Card>
      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="flex flex-col gap-4 rounded-none md:flex-row md:items-center"
      >
        Tổng số đơn hàng theo tháng
      </CardHeader>
      <CardBody className="px-2 pb-0">
        {isDataAvailable ? (
          <Chart {...chartConfig} />
        ) : (
          <p className="my-8 text-center text-gray-500">Không có dữ liệu doanh thu để hiển thị.</p>
        )}
      </CardBody>
    </Card>
  );
};

export default BarChart;
