import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { getOrderList } from "../../services/Staff/OrderService";
import { getRentalsList } from "../../services/Staff/RentalService";
import { height } from "@fortawesome/free-regular-svg-icons/faAddressBook";

const PieChart = () => {
  const [chartData, setChartData] = useState({
    series: [],
    labels: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersData = await getOrderList();
        const rentalsData = await getRentalsList();

        // Calculate totalAmount for orders and rentals
        const ordersTotal = ordersData.reduce(
          (acc, order) => acc + (order.totalAmount || 0),
          0
        );
        const rentalsTotal = rentalsData.reduce(
          (acc, rental) => acc + (rental.totalAmount || 0),
          0
        );

        // Update chart data
        setChartData({
          series: [ordersTotal, rentalsTotal],
          labels: ["Doanh thu đơn đã bán", "Doanh thu đơn cho thuê"],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    chart: {
      width: 380,
      type: "pie",
    },
    labels: chartData.labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
            height: 100
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div>
      <div id="chart">
        <h3>Tổng doanh thu tính đến hiện tại</h3>
        <ReactApexChart
          options={chartOptions}
          series={chartData.series}
          type="pie"
          width={500}
          height={400}
        />
      </div>
    </div>
  );
};

export default PieChart;
