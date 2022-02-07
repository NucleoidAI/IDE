import "./ParamTable.css";
import { DataGrid } from "@mui/x-data-grid";
import Schema from "./Schema";
import { v4 as uuid } from "uuid";
import { Divider, Grid, MenuItem, Select, TextField } from "@mui/material";
import React, { forwardRef, useEffect, useRef, useState } from "react";

const APITypes = forwardRef((props, ref) => {
  const types = ref.current;

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
    <Grid container justifyContent={"space-between"} sx={{ height: "100%" }}>
      <Grid item md sx={{ margin: 3 }}>
        <DataGrid
          sx={{ border: "none" }}
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
      <Divider orientation={"vertical"} sx={{ height: 350 }} />
      <Grid item md sx={{ margin: 3 }}>
        <Schema key={uuid()} ref={schema} />
      </Grid>
    </Grid>
  );
});

export default APITypes;
