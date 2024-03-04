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
import { useRef } from "react";

function APIDialog() {
  const requestSchemaRef = useRef();
  const responseSchemaRef = useRef();
  const typesRef = useRef();
  const paramsRef = useRef();

  const [context, dispatch] = useContext();

  const { open, view } = context.get("pages.api.dialog");

  const selected = context.get("pages.api.selected");
  const selectedApi = context
    .get("nucleoid.api")
    .find(
      (api) => api.path === selected?.path && api.method === selected.method
    );

  paramsRef.current = selectedApi?.params;

  if (selectedApi?.params) {
    paramsRef.current = selectedApi.params.map((param, index) => ({
      ...param,
      id: index + 1,
    }));
  }

  const tstypes = getTypes(context.get("nucleoid.functions"));
  const nuctypes = context.get("nucleoid.types");
  const types = [...nuctypes, ...tstypes];

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

      case "params":
        console.log("params");
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
          saveApiDialog={() => saveApiDialog}
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
          saveApiDialog={() => saveApiDialog()}
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
      return <APIParams types={types} ref={paramsRef} />;
    default:
      return "a";
  }
}

export default APIDialog;
