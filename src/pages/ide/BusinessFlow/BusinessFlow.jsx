import BasicFlow from "./BasicFlow";
import React from "react";
import { Box, Card } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid"; //eslint-disable-line

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
  ];

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={8}
      rowsPerPageOptions={[8]}
      disableSelectionOnClick
      experimentalFeatures={{ newEditingApi: true }}
    />
  );
};

const BusinessFlow = () => {
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
      });
    }
    return list;
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Box
        sx={{
          height: "50%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Card
          sx={{
            width: "100%",
            height: "98%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
            }}
          >
            <BasicFlow />
          </Box>
        </Card>
      </Box>
      <Box sx={{ height: "50%" }}>
        <NucDataGrid rows={generateRandomList(150)} />
      </Box>
    </Box>
  );
};

export default BusinessFlow;
