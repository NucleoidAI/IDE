import { DataGrid } from "@mui/x-data-grid"; //eslint-disable-line
import React from "react";
import { useTheme } from "@mui/material/styles";

import { Box, Button, Card, Grid, useMediaQuery } from "@mui/material";
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
      pageSize={17}
      rowsPerPageOptions={[8]}
      disableSelectionOnClick
      experimentalFeatures={{ newEditingApi: true }}
    />
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const generateRandomList = (length) => {
    const list = [];
    for (let i = 0; i < length; i++) {
      list.push({
        id: i + 1,
        name: `order${i + 129}`,
        item: Math.random().toString(36).substring(5),
        order: Math.random().toString().substring(5),
        date: new Date(),
        status: Math.floor(Math.random() * 2) ? "IN_PROGRESS" : "COMPLETED",
        cancel: !!Math.floor(Math.random() * 2),
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
          "rgba(244, 91, 105, 0.5)",
          "rgba(64, 188, 216, 0.5)",
          "rgba(22, 219, 147, 0.5)",
          "rgba(255, 238, 136, 0.5)",
          "rgba(231, 233, 237, 0.5)",
          "rgba(244, 91, 105, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Line Chart",
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
        label: "Dataset",
        data: labels.map(() => Math.random() * 100),
        borderColor: "rgba(64, 188, 216, 0.5)",
        backgroundColor: "rgba(64, 188, 216, 0.5)",
      },
    ],
  };

  return (
    <Box sx={{ height: matchDownSM ? 1700 : "100%" }}>
      <Box
        sx={{
          height: "40%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid
          container
          sx={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item sx={{ width: "100%" }} sm={12} md={4} lg={4}>
            <Card
              sx={{
                width: "99%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: 300, height: 300 }}>
                <PolarArea data={data} />
              </Box>
            </Card>
          </Grid>
          <Grid item sx={{ width: "100%" }} sm={12} md={8} lg={8}>
            <Card
              sx={{
                width: "99%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  height: 300,
                  width: matchDownSM ? 350 : 700,
                }}
              >
                <Line options={options} data={dataAreaChart} />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ height: "60%" }}>
        <NucDataGrid rows={generateRandomList(150)} />
      </Box>
    </Box>
  );
};

export default Dashboard;
