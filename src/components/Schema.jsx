import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import React from "react";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import SchemaArray from "./SchemaArray";
import SchemaObject from "./SchemaObject";
import SchemaProperty from "./SchemaProperty";
import SchemaView from "./SchemaView";
import TreeView from "@mui/lab/TreeView";
import TypeMenu from "./TypeMenu";
import { decompile } from "../widgets/APIDialog/Context";
import { compile as mapSchema } from "../utils/Map";
import { v4 as uuid } from "uuid";

import { Grid, IconButton, Typography } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";

const Schema = forwardRef(({ request, response, types, edit }, ref) => {
  const [schema, setSchema] = useState(ref.current || ref);
  const [addIcon, setAddIcon] = useState();
  const [removeIcon, setRemoveIcon] = useState();
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState([]);
  const [key, setKey] = useState("");

  const expandList = [];

  const root = schema[Object.keys(schema)[0]].id;
  const map = mapSchema(schema);

  const handleToggle = (event, ids) => {
    setExpanded(ids);
  };

  const handleExpandClick = () => {
    setExpanded([...expandList]);
  };

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
    handleExpandClick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return (
    <Grid
      container
      direction={"column"}
      style={{ height: "100%" }}
      justifyContent={"space-between"}
    >
      <Grid item>
        {!edit && (
          <Grid container justifyContent={"center"} alignItems={"center"}>
            <Typography fontWeight={"bolder"} fontSize={"medium"}>
              {request ? "Request" : "Response"}
            </Typography>
          </Grid>
        )}
        {edit && (
          <Grid container justifyContent={"center"} alignItems={"center"}>
            <>
              Type:&nbsp;
              <TypeMenu
                objAndArr
                globalTypes
                type={schema.type || "object"}
                types={types}
                map={schema[Object.keys(schema)]}
                edit={edit}
                setKey={setKey}
              />
            </>
            <br />
          </Grid>
        )}

        <Grid
          sx={
            edit && {
              width: "100%",
              maxWidth: 405,
              height: 310,
              overflowY: "auto",
            }
          }
        >
          <TreeView
            defaultCollapseIcon={<RemoveCircleOutlineIcon />}
            defaultExpandIcon={<AddCircleOutlineIcon />}
            onNodeToggle={handleToggle}
            expanded={expanded}
            selected={selected}
            onNodeSelect={(event, value) => select(value)}
          >
            {compile(edit, map, schema, types, expandList, setKey)}
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

const compile = (edit, map, schema, types, expandList, setKey, name) => {
  schema = schema[Object.keys(schema)[0]];
  const { id, properties, items, type } = schema || {};
  const children = [];

  if (!id) return null;

  switch (type) {
    case "array": {
      const item = items[Object.keys(items)[0]];
      expandList.push(id);
      children.push(
        compile(edit, map, { root: item }, types, expandList, setKey, name)
      );

      return (
        <SchemaArray
          key={id || (name ? uuid() : "root")}
          nodeId={id || (name ? uuid() : "root")}
          id={id || (name ? uuid() : "root")}
          name={schema.name}
          edit={edit}
          children={children}
          type={type}
          types={types}
          map={map[id]}
          setKey={setKey}
        />
      );
    }
    case "object": {
      for (const key in properties) {
        const property = properties[key];
        expandList.push(id);

        children.push(
          compile(
            edit,
            map,
            { root: property },
            types,
            expandList,
            setKey,
            name
          )
        );
      }

      return (
        <SchemaObject
          id={id || (name ? uuid() : "root")}
          key={id || (name ? uuid() : "root")}
          nodeId={id || (name ? uuid() : "root")}
          name={schema.name}
          edit={edit}
          children={children}
          map={map[id]}
        />
      );
    }
    default:
      if (
        schema.type !== "integer" &&
        schema.type !== "string" &&
        schema.type !== "boolean"
      ) {
        if (types) {
          const item = decompile(
            types.filter(
              (type) => type[Object.keys(type)].name === schema.type
            )[0]
          );

          return (
            <Grid key={schema.id}>
              {!edit && <>{schema.type}</>}
              {schema.name && (
                <SchemaProperty
                  id={id}
                  key={schema.id}
                  nodeId={schema.id}
                  name={schema.name}
                  type={type}
                  types={types}
                  edit={edit}
                  map={map[id]}
                  setKey={setKey}
                />
              )}
              <SchemaView key={uuid()} schema={item} />
            </Grid>
          );
        }
      }

      return (
        <SchemaProperty
          id={id}
          key={schema.id}
          nodeId={schema.id}
          name={schema.name}
          type={type}
          types={types}
          edit={edit}
          map={map[id]}
          setKey={setKey}
        />
      );
  }
};

export { compile };
export default Schema;
