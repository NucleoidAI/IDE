/* eslint-disable */
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import RemoveIcon from "@mui/icons-material/Remove";
import Schema from "../Schema";
import styles from "./styles";
import { v4 as uuid } from "uuid";

import { Divider, Grid, IconButton, TextField } from "@mui/material";
import React, { useRef, useState } from "react";

const APITypes = ({ types }) => {
  console.log(types);
  const columns = [
    {
      field: "name",
      headerName: "Name",
      renderCell: (type) => {
        return "hello";
        /*
        const { id } = type.row;

        const objectIndex = types.findIndex(
          (item) => Object.keys(item)[0] === id
        );
        return (
          <TextField
            defaultValue={type.value}
            sx={{ width: "100%" }}
            onChange={(e) => {
              // types[objectIndex][id].name = e.target.value;
            }}
          />
        );
        */
      },
      flex: 1,
    },
  ];

  return (
    <Grid container sx={styles.root}>
      <Grid item md sx={styles.content}>
        <DataGrid
          sx={styles.dataGrid}
          columns={columns}
          rows={types.map((type) => ({ name: type.name, id: type.name }))}
          hideFooter
        />
        <IconButton onClick={() => console.log("hello")}>
          <AddIcon />
        </IconButton>
      </Grid>
      <Divider orientation={"vertical"} sx={styles.divider} />
      <Grid item md sx={styles.content}>
        .
      </Grid>
    </Grid>
  );
};

export default APITypes;
/* eslint-disable */
