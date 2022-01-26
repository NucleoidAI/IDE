import APIBody from "../components/APIBody";
import APIDialogAction from "../components/APIDialogAction";
import APIParams from "../components/APIParams";
import APIPath from "../components/APIPath";
import APITypes from "../components/APITypes";
import ClosableDialogTitle from "../components/ClosableDialogTitle";
import React from "react";
import { useContext } from "../context";
import { v4 as uuid } from "uuid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 450,
  },
}));

function APIDialog() {
  const classes = useStyles();
  const [state, dispatch] = useContext();
  const { pages } = state;

  const [api, setApi] = React.useState({});
  const [request, setRequest] = React.useState();
  const [response, setResponse] = React.useState();
  const [selected, setSelected] = React.useState();
  const [view, setView] = React.useState();
  const [map, setMap] = React.useState({});
  const [params, setParams] = React.useState();
  const [types, setTypes] = React.useState();
  const [method, setMethod] = React.useState();
  const [selectedParams, setSelectedParams] = React.useState();

  React.useEffect(() => {
    setApi(state.get("nucleoid.api"));
    setRequest(state.get("pages.api.dialog.request"));
    setResponse(state.get("pages.api.dialog.response"));
    setSelected(state.get("pages.api.selected"));
    setView(state.get("pages.api.dialog.view"));
    setMap(state.get("pages.api.dialog.map"));
    setParams(state.get("pages.api.dialog.params"));
    setTypes(state.get("pages.api.dialog.types"));

    if (selected) {
      setMethod(state.get("pages.api.selected").method);
      setSelectedParams(api[selected.path][selected.method].params);
    }
  }, [state, api, selected]);

  const handleClose = () => {
    dispatch({ type: "CLOSE_API_DIALOG" });
  };

  function saveApiDialog() {
    dispatch({ type: "SAVE_API_DIALOG" });
  }

  function setApiDialogView(view) {
    pages.api.dialog.view = view;
    setView(pages.api.dialog.view);
  }

  function addParam() {
    const id = uuid();

    pages.api.dialog.params[id] = map[id] = {
      id: id,
      type: "string",
      required: true,
    };

    const tmpParams = pages.api.dialog.params;

    setParams({ ...tmpParams });
  }

  function removeParam(id) {
    delete pages.api.dialog.params[id];
    delete map[id];

    const tmpParams = pages.api.dialog.params;
    setParams({ ...tmpParams });
  }

  function addSchemaProperty(selected) {
    const tmpMap = pages.api.dialog.map;
    const key = uuid();

    tmpMap[key] = tmpMap[selected].properties[key] = {
      id: key,
      type: "integer",
    };
    setMap({ ...tmpMap });
  }

  function removeSchemaProperty(selected) {
    const tmpMap = pages.api.dialog.map;
    delete tmpMap[selected];

    setMap({ ...tmpMap });
  }

  function updateType(id, value) {
    const tmpMap = pages.api.dialog.map;

    const type = value;

    //  if (name !== undefined) map[id].name = name;
    if (type !== undefined) {
      if (tmpMap[id].type === "array") tmpMap[id].items.type = type;
      else {
        tmpMap[id].type = type;

        if (type === "array") tmpMap[id].items = { type: "integer" };
        else if (type === "object") tmpMap[id].properties = {};
      }
    }

    setMap({ ...tmpMap });
  }

  return (
    <Dialog
      open={Boolean(state.get("pages.api.dialog.open"))}
      fullWidth
      maxWidth={"md"}
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
    >
      <ClosableDialogTitle label={"API"} handleClose={handleClose} />
      <DialogContent>
        <APIPath view={view} setApiDialogView={setApiDialogView} />
        <Grid className={classes.root}>
          {view === "BODY" && (
            <APIBody
              request={request}
              response={response}
              method={method}
              params={selectedParams}
              map={map}
              addSchemaProperty={addSchemaProperty}
              removeSchemaProperty={removeSchemaProperty}
              updateType={updateType}
            />
          )}
          {view === "PARAMS" && (
            <APIParams
              params={params}
              addParam={addParam}
              removeParam={removeParam}
              map={map}
              updateType={updateType}
            />
          )}
          {view === "TYPES" && (
            <APITypes
              map={map}
              dialogTypes={types}
              addSchemaProperty={addSchemaProperty}
              removeSchemaProperty={removeSchemaProperty}
              updateType={updateType}
            />
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <APIDialogAction
          setApiDialogView={setApiDialogView}
          saveApiDialog={saveApiDialog}
          view={view}
        />
      </DialogActions>
    </Dialog>
  );
}

const compile = (map, schema) => {
  const { properties, type, ...other } = schema || {};
  const root = uuid();
  const object = {};

  object[root] = map[root] = {
    ...other,
    id: root,
    type: type ? type : "object",
    properties: {},
  };

  for (const name in properties) {
    const property = properties[name];
    const { type } = property;
    const id = uuid();

    if (property.type === "object") {
      const nested = compile(map, property);
      const key = Object.keys(nested)[0];
      object[root].properties[key] = map[key] = { name, ...nested[key] };
    } else {
      object[root].properties[id] = map[id] = { id, name, type };

      if (type === "array") map[id].items = { type: property.items.type };
    }
  }

  return object;
};

const decompile = (map, schema) => {
  const { type, properties, ...other } = schema[Object.keys(schema)[0]];
  const object = { ...other, type, properties: {} };
  delete object.id;
  delete object.name;

  for (const key in properties) {
    if (!map[key]) continue;

    const property = map[key];
    const { name, type } = property;

    if (!name) continue;

    if (type === "object") {
      const nested = decompile(map, { property });
      object.properties[name] = nested;
    } else {
      object.properties[name] = { type };

      if (type === "array")
        object.properties[name].items = { type: property.items.type };
    }
  }

  return object;
};

const index = (map, list) => {
  const object = {};
  if (!list) return object;

  for (const item of list) {
    const id = uuid();
    object[id] = map[id] = { id, ...item };
  }

  return object;
};

const deindex = (list) =>
  Object.values(list)
    .filter((item) => item.name)
    .map((item) => {
      delete item.id;
      return item;
    });

export { compile, decompile, index, deindex };
export default APIDialog;
