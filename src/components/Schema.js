import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import SchemaArray from "./SchemaArray";
import SchemaObject from "./SchemaObject";
import SchemaProperty from "./SchemaProperty";
//import SchemaType from "./SchemaType";
import { TreeView } from "@mui/lab";
import { compile as mapSchema } from "../utils/Map";
import { v4 as uuid } from "uuid";
import {
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";

const Schema = forwardRef(({ request, response, types, edit }, ref) => {
  const [schema, setSchema] = useState(ref.current || ref);
  const [addIcon, setAddIcon] = useState();
  const [removeIcon, setRemoveIcon] = useState();
  const [selected, setSelected] = useState(null);
  const [rf, setRf] = useState(true);

  const root = schema[Object.keys(schema)[0]].id;
  const map = mapSchema(schema);

  console.log(schema);

  const addSchemaProperty = (selected) => {
    const key = uuid();
    if (!map[selected].properties) {
      map[selected].properties = {};
    }

    map[selected].properties[key] = map[key] = {
      id: key,
      type: "integer",
    };

    setSchema({ ...schema });
  };

  const removeSchemaProperty = (selected) => {
    delete map[selected].id;
    //TODO delete object if it hasn't id in compile method

    setSchema({ ...schema });
  };

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
        {edit && (
          <Grid container justifyContent={"center"} alignItems={"center"}>
            <>
              Type:&nbsp;
              <Select
                value={schema[Object.keys(schema)].type}
                onChange={(e) => {
                  schema[Object.keys(schema)].type = e.target.value;
                  setRf(!rf);
                }}
              >
                {rf}
                <MenuItem value={"object"}>Object</MenuItem>
                <MenuItem value={"array"}>Array</MenuItem>
                <Divider />
                {types.map((item) => (
                  <MenuItem value={item[Object.keys(item)].name}>
                    {item[Object.keys(item)].name}
                  </MenuItem>
                ))}
              </Select>
            </>
          </Grid>
        )}

        <br />
        <Grid sx={edit && { width: "100%", height: 310, overflowY: "auto" }}>
          <TreeView
            defaultCollapseIcon={<RemoveCircleOutlineIcon />}
            defaultExpandIcon={<AddCircleOutlineIcon />}
            defaultExpanded={[root]}
            selected={selected}
            onNodeSelect={(event, value) => select(value)}
          >
            {compile(edit, map, schema, types)}
          </TreeView>
        </Grid>
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
      )}
    </Grid>
  );
});

const compile = (edit, map, schema, types, name) => {
  schema = schema[Object.keys(schema)[0]];
  const { id, properties, items, type } = schema || {};

  const children = [];

  switch (type) {
    case "array": {
      const item = items[Object.keys(items)[0]];

      children.push(compile(edit, map, { root: item }, types, name));

      return (
        <SchemaArray
          key={id || (name ? uuid() : "root")}
          nodeId={id || (name ? uuid() : "root")}
          name={name}
          edit={edit}
          children={children}
          map={map[id]}
        />
      );
    }
    case "object": {
      for (const key in properties) {
        //if (!map[key]) continue;

        //const { name } = map[key];

        const property = properties[key];

        const id = key;

        switch (property.type) {
          case "object":
            children.push(compile(edit, map, { root: property }, types, name));
            break;
          case "array":
            children.push(compile(edit, map, { root: property }, types, name));
            break;

          default:
            children.push(
              <SchemaProperty
                id={id}
                key={id}
                nodeId={id}
                name={property.name}
                type={property.type}
                types={types}
                edit={edit}
                map={map[id]}
              />
            );
            break;
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
    }

    default:
      return "global type";
  }
};

export { compile };
export default Schema;
