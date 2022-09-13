import React from "react";
import { Box, Button, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";//eslint-disable-line
import { Line, PolarArea } from "react-chartjs-2";

const NucDataGrid = ({ rows }) => {
  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    {
      field: "name",
      headerName: "name",
      flex: 1,
      editable: true,
    },
    {
      field: "item",
      headerName: "item",
      flex: 1,
      editable: true,
    },
    {
      field: "order",
      headerName: "order",
      flex: 1,
      editable: true,
    },
    {
      field: "date",
      headerName: "date",
      flex: 1,
      editable: true,
    },
    {
      field: "status",
      headerName: "status",
      flex: 1,
      editable: true,
    },
    {
      field: "cancel",
      headerName: "cancel",
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <Button variant="outlined" disabled={params.row.cancel}>
            Cancel
          </Button>
        );
      },
    },
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={8}
      rowsPerPageOptions={[8]}
      checkboxSelection
      disableSelectionOnClick
      experimentalFeatures={{ newEditingApi: true }}
    />
  );
};

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
        cancel: !Math.floor(Math.random() * 2),
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
        <NucDataGrid rows={generateRandomList(30)} />
      </Box>
    </Box>
  );
};

export default Dashboard;
