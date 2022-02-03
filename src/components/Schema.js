import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import SchemaArray from "./SchemaArray";
import SchemaObject from "./SchemaObject";
import SchemaProperty from "./SchemaProperty";
import { TreeView } from "@mui/lab";
import { v4 as uuid } from "uuid";
import {
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";

const Schema = forwardRef(({ request, schema, response, edit }, ref) => {
  schema = schema || {};

  const [add, setAdd] = useState();
  const [remove, setRemove] = useState();
  const [selected, setSelected] = useState(null);

  let root = edit ? schema[Object.keys(schema)[0]] : "root";
  const map = {};
  const [mp, setMp] = useState(false);

  if (ref?.current) {
    schema = ref?.current[Object.keys(ref?.current)];
    root = edit ? schema[Object.keys(schema)[0]] : "root";

    createMap(schema, map);
  }

  function addSchemaProperty(selected) {
    const key = uuid();
    if (!map[selected].properties) {
      map[selected].properties = {};
    }

    map[selected].properties[key] = map[key] = {
      id: key,
      type: "integer",
    };

    setMp(!mp);
  }

  function removeSchemaProperty(selected) {
    delete map[selected].id;

    setMp(!mp);
  }

  const select = (id) => {
    if (!edit) return;

    if (map[id] && map[id].type === "object") setAdd(true);
    else setAdd(false);

    if (id === root) setRemove(false);
    else setRemove(true);

    if (edit) setSelected(id);
  };

  useEffect(() => {
    if (!selected || (selected && !map[selected])) select(root);
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
          {!edit && request && <b>Request</b>}
          {!edit && response && <b>Response</b>}
          {edit && (
            <>
              Type:&nbsp;
              <Select value={"object"}>
                <MenuItem value={"object"}>Object</MenuItem>
                <MenuItem value={"array"}>Array</MenuItem>
              </Select>
            </>
          )}
        </Grid>
        {edit && <br />}
        <TreeView
          defaultCollapseIcon={<RemoveCircleOutlineIcon />}
          defaultExpandIcon={<AddCircleOutlineIcon />}
          defaultExpanded={[root]}
          selected={selected}
          onNodeSelect={(event, value) => select(value)}
        >
          {compile(map, schema, edit)}
        </TreeView>
      </Grid>
      {edit && (
        <Grid container item justifyContent={"space-between"}>
          <Grid style={{ width: 50 }} />
          <Grid item>
            <Typography variant={"h6"}>
              {request && <>Request</>}
              {response && <>Response</>}
            </Typography>
          </Grid>
          <Grid item>
            {add && (
              <IconButton onClick={() => addSchemaProperty(selected)} size="large">
                <AddIcon />
              </IconButton>
            )}
            {remove && (
              <IconButton onClick={() => removeSchemaProperty(selected)} size="large">
                <RemoveIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
});

const createMap = (schema, map) => {
  const { properties, type } = schema;

  if (schema.name === undefined) {
    const { id } = schema;
    map[id] = schema;
  }

  for (const key in properties) {
    const property = properties[key];

    const { id } = property;
    switch (type) {
      case "object":
        createMap(property, map);
        map[id] = property;
        break;

      default: {
        map[id] = property;
      }
    }
  }
};

const compile = (map, schema, edit, name) => {
  const { id, properties } = schema || {};
  const children = [];

  for (const key in properties) {
    if (edit && !map[key]) continue;

    const { name } = edit ? map[key] : {};
    const property = properties[key];
    const id = edit ? key : uuid();

    switch (property.type) {
      case "object":
        children.push(compile(map, property, edit, edit ? name || "" : key));
        break;
      case "array":
        children.push(
          <SchemaArray
            id={id}
            key={id}
            nodeId={id}
            name={edit ? name || "" : key}
            type={property.type}
            edit={edit}
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
            name={edit ? name : key}
            type={property.type}
            edit={edit}
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
      edit={edit}
      children={children}
      map={map[id]}
    />
  );
};
export { compile };
export default Schema;
