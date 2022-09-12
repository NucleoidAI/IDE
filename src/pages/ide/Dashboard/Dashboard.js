import Box from "@mui/material/Box";
import QueryArrayTable from "components/QueryArrayTable";
import React from "react";

import { Doughnut, Line } from "react-chartjs-2";

const Dashboard = () => {
  //generate random list of strings with id
  const generateRandomList = (length) => {
    const list = [];
    for (let i = 0; i < length; i++) {
      list.push({
        id: i,
        name: Math.random().toString(36).substring(7),
        item: Math.random().toString(36).substring(7),
        order: Math.random().toString(36).substring(7),
        date: new Date(),
        status: !Math.floor(Math.random() * 2),
      });
    }
    return list;
  };

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
      <Box sx={{ height: "50%", width: "100%", display: "flex" }}>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box sx={{ width: 300, height: 300 }}>
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
      <Box sx={{ height: "50%" }}>
        <QueryArrayTable json={generateRandomList(25)} />
      </Box>
    </Box>
  );
};

export default Dashboard;
