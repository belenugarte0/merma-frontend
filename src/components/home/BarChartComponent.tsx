import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChartComponent = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const getGradient1 = () => {
      const ctx = chartRef.current?.getContext("2d");
      if (!ctx) return "rgba(75, 192, 192, 0.5)";
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "#6078ea");
      gradient.addColorStop(1, "#17c5ea");
      return gradient;
    };

    const getGradient2 = () => {
      const ctx = chartRef.current?.getContext("2d");
      if (!ctx) return "rgba(255, 99, 132, 0.5)";
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "#f87171");
      gradient.addColorStop(1, "#ef4444");
      return gradient;
    };

    setData({
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1469608, 0],
          backgroundColor: getGradient2(),
          borderWidth: 1,
          barPercentage: 0.5,
          borderRadius: 20,
          categoryPercentage: 0.8,
        },
        {
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8430392, 0],
          backgroundColor: getGradient1(),
          borderWidth: 1,
          barPercentage: 0.5,
          borderRadius: 20,
          categoryPercentage: 0.8,
        },

       
      ],
    });
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ position: "relative", height: "300px", width: "100%" }}>
      {data && <Bar data={data} options={options} />}
      <canvas ref={chartRef} style={{ display: "none" }} />
    </div>
  );
};
