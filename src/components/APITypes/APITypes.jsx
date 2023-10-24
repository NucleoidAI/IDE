/* eslint-disable */
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import RemoveIcon from "@mui/icons-material/Remove";
import Schema from "../Schema";
import Types from "../../lib/TypeScript";
import styles from "./styles";
import { v4 as uuid } from "uuid";

import { Divider, Grid, IconButton, TextField } from "@mui/material";
import React, { forwardRef, useRef, useState } from "react";

const APITypes = forwardRef((props, typesRef) => {
  const types = typesRef.current;
  const typesTS = Types.getTypes();
  const openAPITypes = Types.getOpenApiSchemas();
  const [selected, setSelected] = useState(types.length ? types[0] : {});
  const [selectedTypeName, setSelectedTypeName] = useState(null);

  const schema = useRef(types.length ? types[0] : null);

  const addType = () => {
    const id = uuid();
    types.push({ [id]: { name: "", id, type: "object", properties: {} } });

    setSchema(types[types.length - 1]);
    setSelected(types[types.length - 1]);
  };

  const removeType = () => {
    const id = Object.keys(selected)[0];
    const index = types.findIndex((item) => Object.keys(item)[0] === id);
    types.splice(index, 1);

    setSchema(types[0]);
    setSelected(types.length ? types[0] : {});
  };

  const setSchema = (obj) => {
    schema.current = obj || null;
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      renderCell: (type) => {
        const { id } = type.row;

        const objectIndex = types.findIndex(
          (item) => Object.keys(item)[0] === id
        );
        return (
          <TextField
            defaultValue={type.value}
            sx={{ width: "100%" }}
            onChange={(e) => {
              types[objectIndex][id].name = e.target.value;
            }}
          />
        );
      },
      flex: 1,
    },
  ];
  const renderTypeNames = () => {
    return (
      <div style={{ marginTop: "20px" }}>
        <h3>Type Names:</h3>
        {typesTS.map((typeInfo, index) => (
          <div key={index} style={{ cursor: "pointer" }}>
            <span onClick={() => setSelectedTypeName(typeInfo.typeName)}>
              {typeInfo.typeName}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderTypeDefinitions = () => {
    const selectedType = typesTS.find(
      (type) => type.typeName === selectedTypeName
    );

    if (!selectedType) {
      return <div>No type selected</div>;
    }

    return (
      <div>
        <h3>Type Definitions:</h3>

        <pre>{JSON.stringify(selectedType.typeDefinition, null, 2)}</pre>
      </div>
    );
  };

  return (
    <Grid container sx={styles.root}>
      <Grid item md sx={styles.content}>
        <DataGrid
          sx={styles.dataGrid}
          columns={columns}
          rows={types.map((type) => type[Object.keys(type)[0]])}
          hideFooter
          onRowClick={({ id }) => {
            setSchema(types.find((type) => type[id]));
            setSelected(types.find((type) => type[id]) || {});
          }}
          // TODO focus will be added
        />
        {renderTypeNames()}
        <IconButton onClick={addType}>
          <AddIcon />
        </IconButton>
        {types.length > 0 && (
          <IconButton onClick={removeType}>
            <RemoveIcon />
          </IconButton>
        )}
      </Grid>
      <Divider orientation={"vertical"} sx={styles.divider} />
      <Grid item md sx={styles.content}>
        {/* {schema.current && (
          <Schema edit key={uuid()} ref={schema} types={types} />
        )} */}
        {renderTypeDefinitions()}
        <h3>OpenAPI Types:</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(openAPITypes, null, 2)}
        </pre>
      </Grid>
    </Grid>
  );
});

export default APITypes;
/* eslint-disable */
