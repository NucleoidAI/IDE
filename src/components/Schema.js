import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import AddIcon from "@material-ui/icons/Add";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import RemoveIcon from "@material-ui/icons/Remove";
import SchemaArray from "./SchemaArray";
import SchemaObject from "./SchemaObject";
import SchemaProperty from "./SchemaProperty";
import { TreeView } from "@material-ui/lab";
import { v4 as uuid } from "uuid";
import {
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";

function Schema({
  request,
  response,
  schema,
  edit,
  map,
  addSchemaProperty,
  removeSchemaProperty,
  updateType,
}) {
  schema = schema || {};

  const [add, setAdd] = useState();
  const [remove, setRemove] = useState();
  const [selected, setSelected] = useState(null);
  const root = edit ? Object.keys(schema || { [uuid]: {} })[0] : "root";

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
          {compile(
            updateType,
            map,
            edit ? (schema ? schema[Object.keys(schema)[0]] : {}) : schema,
            edit
          )}
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
              <IconButton onClick={() => addSchemaProperty(selected)}>
                <AddIcon />
              </IconButton>
            )}
            {remove && (
              <IconButton onClick={() => removeSchemaProperty(selected)}>
                <RemoveIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

const compile = (updateType, map, schema, edit, name) => {
  const { id, properties } = schema || {};
  const children = [];

  for (const key in properties) {
    if (edit && !map[key]) continue;

    const { name } = edit ? map[key] : {};
    const property = properties[key];
    const id = edit ? key : uuid();

    switch (property.type) {
      case "object":
        children.push(
          compile(updateType, map, property, edit, edit ? name || "" : key)
        );
        break;
      case "array":
        children.push(
          <SchemaArray
            map={map}
            id={id}
            key={id}
            nodeId={id}
            name={edit ? name || "" : key}
            type={property.items.type}
            edit={edit}
            updateType={updateType}
          />
        );
        break;
      default:
        children.push(
          <SchemaProperty
            id={id}
            key={id}
            nodeId={id}
            map={map}
            name={edit ? name : key}
            type={property.type}
            edit={edit}
            updateType={updateType}
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
    />
  );
};

export { compile };
export default Schema;
