import APIBody from "../components/APIBody";
import APIDialogAction from "../components/APIDialogAction";
import APIParams from "../components/APIParams";
import APIPath from "../components/APIPath";
import APITypes from "../components/APITypes";
import ClosableDialogTitle from "../components/ClosableDialogTitle";
import React from "react";
import { useContext } from "../context";
import { v4 as uuid } from "uuid";
import { Dialog, DialogActions, DialogContent, Grid } from "@mui/material";

function APIDialog() {
  const [state, dispatch] = useContext();
  const { pages } = state;

  const [view, setView] = React.useState(state.get("pages.api.dialog.view"));

  const api = state.get("nucleoid.api");
  const selected = state.get("pages.api.selected");
  const types = state.get("pages.api.dialog.types");

  let method;
  let path;

  if (selected) {
    method = selected.method;
    path = selected.path;
  } else {
    method = "get";
    path = "/";
  }

  const params = api[path][method].params;
  const request = api[path][method].request;
  const response = api[path][method].response;

  const paramsRef = React.useRef(index({}, params));
  const requestRef = React.useRef(compile({}, request));
  const responseRef = React.useRef(compile({}, response));

  if (
    paramsRef.current === undefined &&
    requestRef.current === undefined &&
    responseRef.current === undefined
  ) {
    paramsRef.current = index({}, params);
    requestRef.current = compile({}, request);
    responseRef.current = compile({}, response);
  }

  const handleClose = () => {
    pages.api.dialog.open = false;
    dispatch({ type: "CLOSE_API_DIALOG" });
    setTimeout(() => {
      paramsRef.current = undefined;
      requestRef.current = undefined;
      responseRef.current = undefined;
    }, 0);
  };

  function saveApiDialog() {
    console.log(responseRef.current);
    console.log(decompile({}, responseRef.current));
    /*
    dispatch({
      type: "SAVE_API_DIALOG",
      payload: {
        params: deindex({}, paramsRef.current),
        request: decompile({}, requestRef.current),
        response: decompile({}, responseRef.current),
      },
    });
    */
  }

  function setApiDialogView(view) {
    pages.api.dialog.view = view;
    setView(pages.api.dialog.view);
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
        <Grid sx={{ height: 450 }}>
          {view === "BODY" && (
            <APIBody
              ref={{
                requestRef: requestRef,
                responseRef: responseRef,
                paramsRef: paramsRef,
              }}
              method={method}
            />
          )}
          {view === "PARAMS" && <APIParams ref={paramsRef} />}
          {view === "TYPES" && <APITypes ref={paramsRef} dialogTypes={types} />}
        </Grid>
      </DialogContent>
      <DialogActions>
        <APIDialogAction
          setApiDialogView={setApiDialogView}
          saveApiDialog={saveApiDialog}
          view={view}
        />
      </DialogActions>
      <button onClick={() => console.log(paramsRef, requestRef, responseRef)}>
        params
      </button>
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
    //if (!map[key]) continue;

    const property = schema[Object.keys(schema)[0]];

    const { type } = property;
    console.log(type);

    if (type === "object") {
      const nested = decompile(map, property[key]);
      object.properties[property.name] = nested;
    } else {
      object.properties[property.name] = { type };

      if (type === "array")
        object.properties[property.name].items = { type: property.items.type };
    }
  }

  return object;
};

const index = (map, list) => {
  map = map || {};

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
