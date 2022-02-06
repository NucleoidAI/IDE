import "./ParamTable.css";
import { DataGrid } from "@mui/x-data-grid";
import Schema from "./Schema";
import { v4 as uuid } from "uuid";
import {
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField,
  makeStyles,
} from "@material-ui/core";
import React, { forwardRef, useEffect, useRef, useState } from "react";

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

const APITypes = forwardRef((props, ref) => {
  const types = ref.current;
  const classes = useStyles();

  const [selected, setSelected] = useState(types.length ? types[0] : {});
  const [selectionModel, setSelectionModel] = useState([]);

  const schema = useRef(selected);

  useEffect(() => {
    schema.current = selected;
  }, [selected]);

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
        return <TextField defaultValue={type.value} />;
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
        <Schema key={uuid()} ref={schema} />
      </Grid>
    </Grid>
  );
});

export default APITypes;
