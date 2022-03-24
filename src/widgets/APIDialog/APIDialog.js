import APIBody from "../../components/APIBody";
import APIDialogAction from "../../components/APIDialogAction";
import APIParams from "../../components/APIParams";
import APIPath from "../../components/APIPath";
import APITypes from "../../components/APITypes";
import ClosableDialogTitle from "../../components/ClosableDialogTitle";
import actions from "../../actions";
import styles from "./styles";
import { useStore } from "../../store";
import { Dialog, DialogActions, DialogContent, Grid } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { compile, decompile, deindex, index, updatePath } from "./Context";

function APIDialog() {
  const [context, dispatch] = useStore();
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

  useEffect(() => {
    selectedRef.current = context.get("pages.api.selected");

    if (!selectedRef.current) return;
    const { method, path } = selectedRef.current;

    setPath(path);
    apiRef.current = context.get("nucleoid.api");
    pathRef.current = path;

    const initEdit = (method, path) => {
      setMethod(method);
      setParams(apiRef.current[path][method].params);
      paramsRef.current = index(apiRef.current[path][method].params);

      typesRef.current = Object.entries(context.get("nucleoid.types"))
        .map(([key, value]) => ({
          ...value,
          name: key,
          type: value.type,
        }))
        .map((type) => compile(type));

      requestRef.current = compile(apiRef.current[path][method].request);
      responseRef.current = compile(apiRef.current[path][method].response);
    };

    const initMethod = () => {
      setMethod(null);
      typesRef.current = index([]);
      paramsRef.current = index([]);
      requestRef.current = compile({ properties: {} });
      responseRef.current = compile({ properties: {} });
      typesRef.current = Object.entries([])
        .map(([key, value]) => ({
          ...value,
          name: key,
          type: value.type,
        }))
        .map((type) => compile(type));
    };

    const initResource = () => {
      setMethod("get");
      pathRef.current = pathRef.current + "/";
      typesRef.current = index([]);
      paramsRef.current = index([]);
      requestRef.current = compile({ properties: {} });
      responseRef.current = compile({ properties: {} });
      typesRef.current = Object.entries([])
        .map(([key, value]) => ({
          ...value,
          name: key,
          type: value.type,
        }))
        .map((type) => compile(type));
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
    const params = Object.keys(paramsRef.current).map(
      (item) => paramsRef.current[item]
    );

    setParams(params);
  };

  const deleteMethod = () => {
    dispatch({ type: "DELETE_METHOD" });
    handleClose();
  };

  const checkMethodDeletable = () => {
    const { pages, nucleoid } = context;
    const { api } = nucleoid;
    const path = pages.api.selected.path;

    if (action === "add") return true;
    if (pages.api) {
      return Object.keys(api[path]).length <= 1 ? true : false;
    }
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
            ref={{ apiRef, pathRef }}
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
