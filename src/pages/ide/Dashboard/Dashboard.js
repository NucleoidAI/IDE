import Box from "@mui/material/Box";
import QueryArrayTable from "components/QueryArrayTable";
import React from "react";

import { Doughnut, Line } from "react-chartjs-2";

const Dashboard = () => {
  const options = {
    legend: {
      position: true,
    },
    animation: {
      duration: 1000,
    },
  };

  const data = {
    labels: ["Used", "Free"],
    datasets: [
      {
        backgroundColor: ["rgba(64, 188, 216, 0.5)", "rgba(22, 219, 147, 0.5)"],
        data: [75, 25],
        borderWidth: 0,
      },
    ],
  };
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const dataLine = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => Math.random() * 1000),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        yAxisID: "y",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => Math.random() * 1000),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        yAxisID: "y1",
      },
    ],
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Box sx={{ height: "40%", width: "100%", display: "flex" }}>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: 360, height: 360 }}>
            <Doughnut data={data} options={options} />
          </Box>
        </Box>
        <Box sx={{ width: "50%", display: "flex", alignItems: "center" }}>
          <Line
            datasetIdKey="id"
            options={{
              responsive: true,
              interaction: {
                mode: "index",
                intersect: false,
              },
              stacked: false,
              plugins: {
                title: {
                  display: true,
                  text: "",
                },
              },
              scales: {
                y: {
                  type: "linear",
                  display: true,
                  position: "left",
                },
                y1: {
                  type: "linear",
                  display: true,
                  position: "right",
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
            }}
            data={dataLine}
          />
        </Box>
      </Box>
      <Box sx={{ height: "60%" }}>
        <QueryArrayTable json={[{ id: "test", name: "test" }]} />
      </Box>
    </Box>
  );
};

export default Dashboard;
