import { DataGrid } from "@mui/x-data-grid";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React from "react";
import TypeMenu from "../TypeMenu";
import styles from "./styles";

import { Checkbox, IconButton, InputBase } from "@mui/material";

const ParamTable = ({ types, params, setParams }) => {
  const columns = [
    {
      field: "name",
      headerName: "Name",
      renderCell: (param) => {
        const { id } = param.row;
        return (
          <InputBase
            disabled={param.row.in === "path"}
            value={param.value || ""}
            onChange={(event) => updateParam(id, "name", event.target.value)}
            fullWidth
            placeholder="Enter name"
          />
        );
      },
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      renderCell: (param) => {
        const { id } = param.row;
        return (
          <TypeMenu
            disabled={param.row.in === "path"}
            primitive
            types={types}
            id={id}
            type={param.value}
            onChange={(type) => updateParam(id, "type", type)}
          />
        );
      },
      flex: 1,
    },
    {
      field: "in",
      headerName: "Param",
      flex: 1,
      valueGetter: (param) => param.value || "query",
    },
    {
      field: "required",
      headerName: "Required",
      renderCell: (param) => {
        const { id } = param.row;
        return (
          <Checkbox
            disabled={param.row.in === "path"}
            checked={param.value}
            onChange={(event) =>
              updateParam(id, "required", event.target.checked)
            }
          />
        );
      },
      flex: 1,
    },
    {
      field: "description",
      headerName: "Description",
      renderCell: (param) => {
        const { id } = param.row;
        return (
          <InputBase
            disabled={param.row.in === "path"}
            value={param.value || ""}
            onChange={(event) =>
              updateParam(id, "description", event.target.value)
            }
            fullWidth
            placeholder="Enter description"
          />
        );
      },
      flex: 2,
    },
    {
      field: "action",
      headerName: " ",
      sortable: false,
      renderCell: (param) => {
        const { id } = param.row;
        return (
          <IconButton
            disabled={param.row.in === "path"}
            onClick={() => removeParam(id)}
            size="large"
          >
            <HighlightOffIcon />
          </IconButton>
        );
      },
    },
  ];

  const removeParam = (id) => {
    setParams((prevParams) => prevParams.filter((param) => param.id !== id));
  };

  const updateParam = (id, field, value) => {
    setParams((prevParams) =>
      prevParams.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  return (
    <DataGrid
      sx={styles.dataGrid}
      columns={columns}
      rows={params}
      hideFooter
      disableSelectionOnClick
    />
  );
};

export default ParamTable;
