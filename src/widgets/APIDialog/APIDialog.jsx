import APIBody from "../../components/APIBody";
import APIDialogAction from "../../components/APIDialogAction";
import APIParams from "../../components/APIParams";
import APIPath from "../../components/APIPath";
import APITypes from "../../components/APITypes";
import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import Defaults from "../../defaults";
import actions from "../../actions";
import styles from "./styles";
import { useContext } from "../../context/context";
import { v4 as uuid } from "uuid";

import { Dialog, DialogActions, DialogContent, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
  checkPath,
  compile,
  decompile,
  deindex,
  index,
  updateParams,
  updatePath,
} from "./Context";

function APIDialog() {
  const [context, dispatch] = useContext();
  const { pages } = context;
  const [method, setMethod] = useState();
  const [path, setPath] = useState();
  const [saveDisable, setSaveDisable] = useState(false);
  const [deleteDisable, setDeleteDisable] = useState(false);
  const [view, setView] = useState(context.get("pages.api.dialog.view"));
  const [params, setParams] = useState([]);
  const { action, type } = pages.api.dialog;

  const paramsRef = useRef();
  const typesRef = useRef();
  const requestRef = useRef();
  const responseRef = useRef();
  const pathRef = useRef();
  const apiRef = useRef();
  const selectedRef = useRef();

  const paramsPathRef = useRef();

  useEffect(() => {
    selectedRef.current = context.get("pages.api.selected");

    if (!selectedRef.current) return;
    const { method, path } = selectedRef.current;
    setPath(path);
    apiRef.current = context.get("nucleoid.api");
    pathRef.current = path;

    const findPaths = (url) => {
      return url.match(/{\w*}/g) === null
        ? []
        : url.match(/{\w*}/g).map((item) => item.substring(1, item.length - 1));
    };

    const initEdit = (method, path) => {
      const route = apiRef.current.find(
        (route) =>
          route.path === path &&
          route.method.toLowerCase() === method.toLowerCase()
      );

      if (!route) {
        console.error(
          "No matching route found for method and path:",
          method,
          path
        );
        return;
      }

      setMethod(method);

      setParams(route.params);
      paramsRef.current = index(route.params);
      requestRef.current = route.request ? compile(route.request) : null;
      responseRef.current = route.response ? compile(route.response) : null;
      typesRef.current = context.get("nucleoid.types").map((schemaObject) => {
        const { name, schema } = schemaObject;
        const compiledSchema = compile(schema);
        return {
          name,
          type: schema.type,
          ...compiledSchema,
        };
      });
    };

    const initMethod = () => {
      const paths = findPaths(pathRef.current).map((item) => {
        return {
          id: uuid(),
          in: "path",
          name: item,
          description: item + " path",
          type: "string",
          required: true,
        };
      });

      setMethod(null);
      setParams(paths);
      paramsRef.current = index(paths);
      requestRef.current = compile(Defaults.object);
      responseRef.current = compile(Defaults.object);
      typesRef.current = context.get("nucleoid.types").map((schemaObject) => {
        const { name, schema } = schemaObject;
        const compiledSchema = compile(schema);
        return {
          name,
          type: schema.type,
          ...compiledSchema,
        };
      });
    };

    const initResource = () => {
      const paths = findPaths(pathRef.current).map((item) => {
        return {
          id: uuid(),
          in: "path",
          name: item,
          description: item + " path",
          type: "string",
          required: true,
        };
      });

      setParams(paths);
      setMethod("get");

      pathRef.current = pathRef.current + "/";
      paramsRef.current = index(paths);
      requestRef.current = compile(Defaults.object);
      responseRef.current = compile(Defaults.object);
      typesRef.current = context.get("nucleoid.types").map((schemaObject) => {
        const { name, schema } = schemaObject;
        const compiledSchema = compile(schema);
        return {
          name,
          type: schema.type,
          ...compiledSchema,
        };
      });
    };

    if (type === "method" && action === "edit") {
      initEdit(method, path);
    }

    if (type === "method" && action === "add") {
      initMethod();
    }

    if (type === "resource" && action === "add") {
      initResource();
      setPath(path + "/");
    }

    setDeleteDisable(checkMethodDeletable());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, type, action]);

  const handleClose = () => dispatch({ type: actions.closeApiDialog });

  const saveApiDialog = () => {
    if (selectedRef.current.path !== pathRef.current) {
      selectedRef.current.path = pathRef.current;

      if (type === "method") {
        updatePath(apiRef.current, path, pathRef.current);
        updateParams(apiRef.current, path, pathRef.current, paramsRef);
      } else {
        // create new path res
        const id = uuid();
        paramsRef.current[id] = {
          id,
          in: "path",
          name: checkPath(pathRef.current.split("/").pop()),
          required: true,
          type: "string",
          description: checkPath(pathRef.current.split("/").pop()) + " path",
        };
      }
    }

    dispatch({
      type: actions.saveApiDialog,
      payload: {
        method,
        path: pathRef.current,
        params: deindex(paramsRef.current),
        request: decompile(requestRef.current),
        response: decompile(responseRef.current),
        action: Defaults.action,
        summary: Defaults.summary,
        description: Defaults.description,
        types: typesRef.current.reduce((previous, current) => {
          const object = decompile(current);
          const name = current[Object.keys(current)[0]].name;
          return { ...previous, [name]: object };
        }, {}),
      },
    });

    handleClose();
  };

  const handleChangeMethod = (method) => {
    setMethod(method);
  };

  const handleSaveButtonStatus = (status) => {
    setSaveDisable(status);
  };

  const setApiDialogView = (view) => {
    setView((pages.api.dialog.view = view));
    handleSetParams();
  };

  const deleteMethod = () => {
    dispatch({ type: "DELETE_METHOD" });
    handleClose();
  };

  const checkMethodDeletable = () => {
    const { pages, nucleoid } = context;
    const { api } = nucleoid;

    const selectedPath = pages.api.selected?.path;

    if (action === "add") return true;

    if (pages.api && selectedPath) {
      const samePathCount = api.filter(
        (endpoint) => endpoint.path === selectedPath
      ).length;
      return samePathCount <= 1;
    }
    return false;
  };

  const handleSetParams = () => {
    const params = Object.keys(paramsRef.current).map(
      (item) => paramsRef.current[item]
    );

    setParams(params);
  };

  if (context.get("pages.api.dialog.open")) {
    return (
      <Dialog
        open={true}
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
            ref={{ apiRef, pathRef, paramsRef, paramsPathRef }}
          />
          <Grid sx={styles.content}>
            {view === "BODY" && (
              <APIBody
                method={method}
                params={params}
                types={typesRef.current}
                ref={{ requestRef, responseRef }}
              />
            )}
            {view === "PARAMS" && (
              <APIParams types={typesRef.current} ref={paramsRef} />
            )}
            {view === "TYPES" && <APITypes ref={typesRef} />}
          </Grid>
        </DialogContent>
        <DialogActions>
          <APIDialogAction
            setApiDialogView={setApiDialogView}
            saveApiDialog={saveApiDialog}
            saveDisable={saveDisable}
            view={view}
            deleteDisable={deleteDisable}
            deleteMethod={deleteMethod}
          />
        </DialogActions>
      </Dialog>
    );
  } else return null;
}

export default APIDialog;
