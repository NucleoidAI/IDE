import QueryArrayTable from "components/QueryArrayTable";
import React from "react";
import { Box, Card } from "@mui/material";
import { Line, PolarArea } from "react-chartjs-2";

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

  const data = {
    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
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

  const dataAreaChart = {
    labels,
    datasets: [
      {
        fill: true,
        label: "Dataset 2",
        data: labels.map(() => Math.random() * 100),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Box
        sx={{
          height: "40%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Card
          sx={{
            width: "40%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: 350 }}>
            <PolarArea data={data} />
          </Box>
        </Card>
        <Card
          sx={{
            width: "60%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 700,
              maxHeight: 350,
            }}
          >
            <Line options={options} data={dataAreaChart} />
          </Box>{" "}
        </Card>
      </Box>
      <Box sx={{ height: "60%" }}>
        <QueryArrayTable json={generateRandomList(25)} pageSize={9} />
      </Box>
    </Box>
  );
};

export default Dashboard;
