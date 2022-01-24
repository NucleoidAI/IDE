import "./ParamTable.css";
import { DataGrid } from "@mui/x-data-grid";
import Schema from "./Schema";
import {
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
  divider: {
    height: 350,
  },
  params: {
    height: "100%",
    width: 400,
    margin: 8,
  },
  table: {
    border: "none",
  },
}));

function APITypes({ map, dialogTypes }) {
  const classes = useStyles();

  const types = Object.values(dialogTypes || {});

  const [selected, setSelected] = useState(types.length ? types[0] : {});
  const [selectionModel, setSelectionModel] = useState([]);

  useEffect(() => {
    const initial = Object.keys(selected)[0];
    setSelectionModel([initial]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      renderCell: (type) => {
        const { id } = type.row;
        return (
          <TextField
            defaultValue={type.value}
            onChange={(event) => (map[id].name = event.target.value)}
          />
        );
      },
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      renderCell: (type) => {
        return (
          <Select value={type.value}>
            <MenuItem value={"object"}>Object</MenuItem>
            <MenuItem value={"array"}>Array</MenuItem>
          </Select>
        );
      },
      flex: 1,
    },
  ];

  return (
    <Grid container justifyContent={"space-between"} className={classes.root}>
      <Grid item className={classes.params}>
        <DataGrid
          className={classes.table}
          columns={columns}
          rows={types.map((type) => type[Object.keys(type)[0]])}
          onSelectionModelChange={(newSelectionModel) => {
            const [id] = newSelectionModel;
            setSelectionModel(newSelectionModel);
            setSelected(types.find((type) => type[id]));
          }}
          selectionModel={selectionModel}
          hideFooter
        />
      </Grid>
      <Divider orientation={"vertical"} className={classes.divider} />
      <Grid item className={classes.params}>
        <Schema key={selectionModel[0]} schema={selected} edit />
      </Grid>
    </Grid>
  );
}

export default APITypes;
