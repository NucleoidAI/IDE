import APIBody from "../components/APIBody";
import APIDialogAction from "../components/APIDialogAction";
import APIParams from "../components/APIParams";
import APIPath from "../components/APIPath";
import APITypes from "../components/APITypes";
import ClosableDialogTitle from "../components/ClosableDialogTitle";

import { useContext } from "../context";
import { useRef } from "react";
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

  /*
  const [api, setApi] = React.useState({});
  const [request, setRequest] = React.useState();

  //const [selected, setSelected] = React.useState();
  const [view, setView] = React.useState();
  const [map, setMap] = React.useState({});
  const [types, setTypes] = React.useState();
  const [method, setMethod] = React.useState();
  const [selectedParams, setSelectedParams] = React.useState();
  const [open, setOpen] = React.useState();
*/

  const api = state.get("nucleoid.api");
  const selected = state.get("pages.api.selected");

  const view = state.get("pages.api.dialog.view");
  const map = state.get("pages.api.dialog.map");
  const types = state.get("pages.api.dialog.types");

  //const selectedParams = api[selected.path][selected.method].params; //TODO: to be deleted

  const paramsRef = useRef();
  const requestRef = useRef();
  const responseRef = useRef();
  let method;

  if (selected) {
    paramsRef.current = index(
      {},
      api[selected.path][selected.method].params || []
    );

    requestRef.current = compile(
      {},
      api[selected.path][selected.method].request
    );

    responseRef.current = compile(
      {},
      api[selected.path][selected.method].response
    );
    method = selected.method;
  }

  const handleClose = () => {
    pages.api.dialog.open = false;
    delete pages.api.dialog.request;
    delete pages.api.dialog.response;
    delete pages.api.dialog.params;
    delete pages.api.dialog.types;
    pages.api.dialog.map = {};
  };

  function saveApiDialog() {
    /*
    const { path, method } = pages.api.selected;
    const api = nucleoid.api;
    const map = pages.api.dialog.map;

    api[path][method].request = decompile(map, pages.api.dialog.request);
    api[path][method].response = decompile(map, pages.api.dialog.response);
    api[path][method].params = deindex(pages.api.dialog.params);
    nucleoid.types = pages.api.dialog.types.reduce((previous, current) => {
      const object = decompile(map, current);
      const name = current[Object.keys(current)[0]].name;
      return { ...previous, [name]: object };
    }, {});

    const isOpen = (pages.api.dialog.open = false);
    setOpen(isOpen);
    */

    dispatch({ type: "SAVE_API_DIALOG" });
  }

  function setApiDialogView(view) {
    pages.api.dialog.view = view;
    // setView(pages.api.dialog.view);
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
              ref={{
                requestRef: requestRef,
                responseRef: responseRef,
                paramsRef: paramsRef,
              }}
              method={method}
            />
          )}
          {view === "PARAMS" && <APIParams ref={paramsRef} />}
          {view === "TYPES" && <APITypes map={map} dialogTypes={types} />}
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
