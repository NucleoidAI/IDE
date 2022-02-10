import APIBody from "../../components/APIBody";
import APIDialogAction from "../../components/APIDialogAction";
import APIParams from "../../components/APIParams";
import APIPath from "../../components/APIPath";
import APITypes from "../../components/APITypes";
import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import styles from "./styles";
import { useContext } from "../../context";
import { v4 as uuid } from "uuid";
import { Dialog, DialogActions, DialogContent, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

function APIDialog() {
  const [context, dispatch] = useContext();
  const { pages } = context;

  const [method, setMethod] = useState();

  const [path, setPath] = useState();
  const [saveDisable, setSaveDisable] = useState(false);
  const [view, setView] = useState(context.get("pages.api.dialog.view"));

  const paramsRef = useRef();
  const [params, setParams] = useState();
  const types = useRef();
  const request = useRef();
  const response = useRef();
  const pathName = useRef();

  const api = useRef();
  const selected = useRef();

  useEffect(() => {
    selected.current = context.get("pages.api.selected");
    if (!selected.current) return;

    const { method, path } = selected.current;
    setMethod(method);
    setPath(path);

    api.current = context.get("nucleoid.api");

    const params = api.current[path][method].params;
    setParams(params);

    pathName.current = path;
    paramsRef.current = index(params);
    types.current = Object.entries(context.nucleoid.types)
      .map(([key, value]) => ({
        ...value,
        name: key,
        type: value.type,
      }))
      .map((type) => compile(type));

    request.current = compile(api.current[path][method].request);
    response.current = compile(api.current[path][method].response);
  }, [context]);

  const handleClose = () => dispatch({ type: "CLOSE_API_DIALOG" });

  const saveApiDialog = () => {
    if (pathName !== path) {
      selected.current.path = pathName.current;

      changePathNames(api.current, path, pathName.current);
    }

    dispatch({
      type: "SAVE_API_DIALOG",
      payload: {
        method: method,
        params: deindex(paramsRef.current),
        request: decompile(request.current),
        response: decompile(response.current),
        types: types.current.reduce((previous, current) => {
          const object = decompile(current);
          const name = current[Object.keys(current)[0]].name;
          return { ...previous, [name]: object };
        }, {}),
      },
    });
  };

  const handleChangeMethod = (method) => {
    setMethod(method);
  };

  const handleSaveButtonStatus = (status) => {
    setSaveDisable(status);
  };

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
        <APIPath
          view={view}
          setApiDialogView={setApiDialogView}
          path={path}
          method={method}
          handleSaveButtonStatus={handleSaveButtonStatus}
          handleChangeMethod={handleChangeMethod}
          ref={{ api: api, pathName: pathName }}
        />
        <Grid sx={styles.content}>
          {view === "BODY" && (
            <APIBody
              method={method}
              params={params}
              ref={{ request, response }}
            />
          )}
          {view === "PARAMS" && <APIParams ref={paramsRef} />}
          {view === "TYPES" && <APITypes ref={types} />}
        </Grid>
      </DialogContent>
      <DialogActions>
        <APIDialogAction
          setApiDialogView={setApiDialogView}
          saveApiDialog={saveApiDialog}
          saveDisable={saveDisable}
          view={view}
        />
      </DialogActions>
    </Dialog>
  );
}

//TODO: Add test.
const changePathNames = (object, pathname, newpathname) => {
  Object.keys(object).forEach((objectname) => {
    if (objectname.includes(pathname)) {
      const objectvalue = { ...object[objectname] };
      delete object[objectname];
      objectname = objectname.replace(pathname, newpathname);
      object[objectname] = { ...objectvalue };
    }
  });
};

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
      const nested = decompile({ root: property });
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
