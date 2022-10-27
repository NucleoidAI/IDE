import BasicFlow from "./BasicFlow";
import React from "react";
import { Box, Button, Card } from "@mui/material";
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

const BusinessFlow = () => {
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
