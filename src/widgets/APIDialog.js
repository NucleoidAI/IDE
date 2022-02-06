import APIBody from "../components/APIBody";
import APIDialogAction from "../components/APIDialogAction";
import APIParams from "../components/APIParams";
import APIPath from "../components/APIPath";
import APITypes from "../components/APITypes";
import ClosableDialogTitle from "../components/ClosableDialogTitle";
import { useContext } from "../context";
import { v4 as uuid } from "uuid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    height: 450,
  },
}));

function APIDialog() {
  const classes = useStyles();
  const [context, dispatch] = useContext();
  const { pages } = context;

  const [method, setMethod] = useState("get");
  const [path, setPath] = useState("/");
  const [view, setView] = useState(context.get("pages.api.dialog.view"));

  const paramsRef = useRef();
  const [params, setParams] = useState();
  const request = useRef();
  const response = useRef();

  useEffect(() => {
    const selected = context.get("pages.api.selected");
    if (!selected) return;

    const { method, path } = selected;
    setMethod(method);
    setPath(path);

    const api = context.get("nucleoid.api");
    const params = api[path][method].params;
    setParams(params);

    paramsRef.current = index(params);
    request.current = compile(api[path][method].request);
    response.current = compile(api[path][method].response);
  }, [context, path, method]);

  const handleClose = () => dispatch({ type: "CLOSE_API_DIALOG" });
  const saveApiDialog = () =>
    dispatch({
      type: "SAVE_API_DIALOG",
      payload: {
        params: deindex(paramsRef.current),
        request: decompile(request.current),
        response: decompile(response.current),
      },
    });

  const setApiDialogView = (view) => {
    setView((pages.api.dialog.view = view));
  };

  return (
    <Dialog
      open={Boolean(context.get("pages.api.dialog.open"))}
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
              method={method}
              params={params}
              ref={{ request, response }}
            />
          )}
          {view === "PARAMS" && <APIParams ref={paramsRef} />}
          {view === "TYPES" && <APITypes />}
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

const compile = (schema) => {
  const { properties, type, ...other } = schema || {};
  const root = uuid();
  const object = {};

  object[root] = {
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
      const nested = compile(property);
      const key = Object.keys(nested)[0];
      object[root].properties[key] = { name, ...nested[key] };
    } else {
      object[root].properties[id] = { id, name, type };

      if (type === "array")
        object[root].properties[id].items = { type: property.items.type };
    }
  }

  return object;
};

const decompile = (schema) => {
  const { type, properties, ...other } = schema[Object.keys(schema)[0]];
  const object = { ...other, type, properties: {} };
  delete object.id;
  delete object.name;

  for (const key in properties) {
    const property = properties[key];

    const { name, type } = property;

    if (type === "object") {
      const nested = decompile({ property });
      object.properties[name] = nested;
    } else {
      object.properties[name] = { type };

      if (type === "array")
        object.properties[name].items = { type: property.items.type };
    }
  }

  return object;
};

const index = (list) => {
  const object = {};
  if (!list) return object;

  for (const item of list) {
    const id = uuid();
    object[id] = { id, ...item };
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
