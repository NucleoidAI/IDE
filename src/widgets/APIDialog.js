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

  const api = state.get("nucleoid.api");
  const request = state.get("pages.api.dialog.request");
  const response = state.get("pages.api.dialog.response");
  const selected = state.get("pages.api.selected");
  const view = state.get("pages.api.dialog.view");
  const map = state.get("pages.api.dialog.map");
  let method;
  let params;
  if (selected) {
    method = state.get("pages.api.selected").method;
    params = api[selected.path][selected.method].params;
  }

  const handleClose = () => {
    dispatch({ type: "CLOSE_API_DIALOG" });
  };

  function setApiDialogView(newAlignment) {
    dispatch({
      type: "SET_API_DIALOG_VIEW",
      payload: { view: newAlignment },
    });
  }

  function saveApiDialog() {
    dispatch({ type: "SAVE_API_DIALOG" });
  }

  function addParam() {
    dispatch({ type: "ADD_PARAM" });
  }

  function removeParam(id) {
    dispatch({ type: "REMOVE_PARAM", payload: { id } });
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
        <APIPath />
        <Grid className={classes.root}>
          {state.get("pages.api.dialog.view") === "BODY" && (
            <APIBody
              request={request}
              response={response}
              method={method}
              params={params}
            />
          )}
          {state.get("pages.api.dialog.view") === "PARAMS" && (
            <APIParams
              params={params}
              addParam={addParam}
              removeParam={removeParam}
              map={map}
            />
          )}
          {state.get("pages.api.dialog.view") === "TYPES" && <APITypes />}
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
