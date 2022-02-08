import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import SchemaArray from "./SchemaArray";
import SchemaObject from "./SchemaObject";
import SchemaProperty from "./SchemaProperty";
import { TreeView } from "@mui/lab";
import { compile as mapSchema } from "../utils/Map";
import { v4 as uuid } from "uuid";
import { Grid, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";

const Schema = forwardRef(({ request, response }, ref) => {
  const [schema, setSchema] = useState(ref.current);
  const [addIcon, setAddIcon] = useState();
  const [removeIcon, setRemoveIcon] = useState();
  const [selected, setSelected] = useState(null);

  const root = schema[Object.keys(schema)[0]].id;
  const map = mapSchema(schema);

  function addSchemaProperty(selected) {
    const key = uuid();
    if (!map[selected].properties) {
      map[selected].properties = {};
    }

    map[selected].properties[key] = map[key] = {
      id: key,
      type: "integer",
    };
    console.log(map);

    setSchema({ ...schema });
  }

  function removeSchemaProperty(selected) {
    delete map[selected].id;

    console.log(ref.current);

    setSchema({ ...schema });
  }

  const select = (id) => {
    if (map[id] && map[id].type === "object") setAddIcon(true);
    else setAddIcon(false);

    if (id === root) setRemoveIcon(false);
    else setRemoveIcon(true);

    setSelected(id);
  };

  useEffect(() => {
    select(root);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid
      container
      direction={"column"}
      style={{ height: "100%" }}
      justifyContent={"space-between"}
    >
      <Grid item>
        <Grid container justifyContent={"center"} alignItems={"center"}>
          <>
            Type:&nbsp;
            <Select value={"object"}>
              <MenuItem value={"object"}>Object</MenuItem>
              <MenuItem value={"array"}>Array</MenuItem>
            </Select>
          </>
        </Grid>
        <br />
        <TreeView
          defaultCollapseIcon={<RemoveCircleOutlineIcon />}
          defaultExpandIcon={<AddCircleOutlineIcon />}
          defaultExpanded={[root]}
          selected={selected}
          onNodeSelect={(event, value) => select(value)}
        >
          {compile(map, schema)}
        </TreeView>
      </Grid>
      <Grid container item justifyContent={"space-between"}>
        <Grid style={{ width: 50 }} />
        <Grid item>
          <Typography variant={"h6"}>
            {request && <>Request</>}
            {response && <>Response</>}
          </Typography>
        </Grid>
        <Grid item>
          {addIcon && (
            <IconButton onClick={() => addSchemaProperty(selected)}>
              <AddIcon />
            </IconButton>
          )}
          {removeIcon && (
            <IconButton onClick={() => removeSchemaProperty(selected)}>
              <RemoveIcon />
            </IconButton>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
});

const compile = (map, schema, name) => {
  schema = schema[Object.keys(schema)[0]];
  const { id, properties } = schema || {};
  const children = [];

  for (const key in properties) {
    if (!map[key]) continue;

    const { name } = map[key];
    const property = properties[key];
    const id = key;

    switch (property.type) {
      case "object":
        children.push(compile(map, { root: property }, name));
        break;
      case "array":
        children.push(
          <SchemaArray
            id={id}
            key={id}
            nodeId={id}
            name={name}
            type={property.type}
            edit
            map={map[id]}
          />
        );
        break;
      default:
        children.push(
          <SchemaProperty
            id={id}
            key={id}
            nodeId={id}
            name={name}
            type={property.type}
            edit
            map={map[id]}
          />
        );
    }
  }

  return (
    <SchemaObject
      key={id || (name ? uuid() : "root")}
      nodeId={id || (name ? uuid() : "root")}
      name={name}
      edit
      children={children}
      map={map[id]}
    />
  );
};
export { compile };
export default Schema;
