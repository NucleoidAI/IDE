import APIDialogAction from "../../components/APIDialogAction";
import APIParams from "../../components/APIParams";
import APIPath from "../../components/APIPath";
import APITypes from "../../components/APITypes";
// import AdressTree from "./Test";
import NewAPIBody from "./NewAPIBody";
import NucDialog from "../../components/core/NucDialog/NucDialog";
//BasicDialog
import React from "react";
import { getTypes } from "../../lib/TypeScript";
import { useContext } from "../../context/context";

import { useEffect, useRef } from "react";

function APIDialog() {
  const requestSchemaRef = useRef();
  const responseSchemaRef = useRef();
  const typesRef = useRef();
  const paramsRef = useRef([]);
  const addParams = useRef(() => {});

  const [context, dispatch] = useContext();

  const { open, view } = context.get("pages.api.dialog");

  const selected = context.pages.api?.selected;
  const contextApis = context.nucleoid.api;

  let selectedApi = null;

  if (Array.isArray(contextApis)) {
    selectedApi = contextApis.find(
      (api) => api.path === selected?.path && api.method === selected.method
    );
  }

  useEffect(() => {
    if (selectedApi?.params) {
      paramsRef.current = selectedApi.params.map((param, index) => ({
        ...param,
        id: index + 1,
      }));
    } else {
      paramsRef.current = [];
    }
  }, [selectedApi]);

  const tstypes = getTypes(context.get("nucleoid.functions"));
  const nuctypes = context.get.nucleoid?.types;

  let types;
  if (Array.isArray(nuctypes)) {
    types = [...nuctypes, ...tstypes];
  } else {
    types = [tstypes];
  }

  const saveApiDialog = () => {
    switch (view) {
      case "TYPES":
        console.log("types", typesRef.current.schemaOutput());
        dispatch({
          type: "UPDATE_API_TYPES",
          payload: {
            updatedTypes: typesRef.current.schemaOutput(),
          },
        });

        break;

      case "BODY":
        dispatch({
          type: "UPDATE_API_SCHEMAS",
          payload: {
            path: selected?.path,
            method: selected?.method,
            requestSchema: requestSchemaRef.current.schemaOutput(),
            responseSchema: responseSchemaRef.current.schemaOutput(),
          },
        });
        break;

      case "PARAMS":
        dispatch({
          type: "SAVE_API_PARAMS",
          payload: {
            path: selected?.path,
            method: selected?.method,
            params: paramsRef.current,
          },
        });
        break;

      default:
        console.log("default");
        return;
    }
  };

  const handleTypesButtonClick = () => {
    dispatch({
      type: "SET_API_DIALOG_VIEW",
      payload: { view: "TYPES" },
    });
  };

  if (open) {
    return (
      <NucDialog
        title={"API"}
        open={open}
        handleClose={() => dispatch({ type: "CLOSE_API_DIALOG" })}
      >
        <APIPath
          method={selectedApi.method}
          path={selectedApi.path}
          onTypesButtonClick={handleTypesButtonClick}
        />

        <TabManager
          view={view}
          tstypes={tstypes}
          nuctypes={nuctypes}
          types={types}
          api={context.nucleoid.api}
          selectedApi={selectedApi}
          requestSchemaRef={requestSchemaRef}
          responseSchemaRef={responseSchemaRef}
          typesRef={typesRef}
          paramsRef={paramsRef}
          addParams={addParams}
          saveApiDialog={saveApiDialog}
        />
        <APIDialogAction
          view={view}
          setApiDialogView={(button) =>
            dispatch({
              type: "SET_API_DIALOG_VIEW",
              payload: { view: button },
            })
          }
          deleteMethod={() => {
            dispatch({
              type: "DELETE_API",
            });
          }}
          saveApiDialog={saveApiDialog}
        />
      </NucDialog>
    );
  } else return null;
}

function TabManager({
  view,
  tstypes,
  nuctypes,
  types,
  paramsRef,
  addParams,
  selectedApi,
  requestSchemaRef,
  responseSchemaRef,
  typesRef,
}) {
  switch (view) {
    case "TYPES":
      return (
        <APITypes tstypes={tstypes} nuctypes={nuctypes} typesRef={typesRef} />
      );
    case "BODY": {
      return (
        <NewAPIBody
          types={types}
          api={selectedApi}
          requestSchemaRef={requestSchemaRef}
          responseSchemaRef={responseSchemaRef}
        />
      );
    }

    case "PARAMS":
      return <APIParams types={types} ref={{ paramsRef, addParams }} />;
    default:
      return "a";
  }
}

export default APIDialog;
