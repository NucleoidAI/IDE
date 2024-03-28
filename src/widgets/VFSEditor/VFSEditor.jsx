import AIDialog from "../AIDialog/AIDialog";
import ApiAIButton from "../../components/ApiAIButton";
import NucEditor from "../../components/NucEditor/NucEditor";
import Path from "../../utils/Path";
import { contextToMap } from "../../utils/Parser";
import { publish } from "@nucleoidai/react-event";

import rules from "./rules";
import service from "../../service";
import { storage } from "@nucleoidjs/webstorage";
import { useContext } from "../../context/context";

import { Box, Grid } from "@mui/material";
import React, { useCallback } from "react";

const options = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules,
  globals: {},
};

const VFSEditor = React.forwardRef((props, ref) => {
  const mode = Path.getMode();
  const { api, functions, query } = props;
  const timerRef = React.useRef();
  const [context] = useContext();
  const editorRef = React.useRef(null);

  const file = getFile(context, props);

  const checkFunction = React.useCallback(() => {
    const editor = editorRef?.current?.editor;
    const monaco = editorRef?.current?.monaco;

    if (!api) return true;

    try {
      monaco.editor.setModelMarkers(editor?.getModel(), "action", []);
      return true;
    } catch (err) {
      console.log(err);
      monaco.editor.setModelMarkers(editor?.getModel(), "action", [
        {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: 1000,
          message: "Need action function",
          severity: 1,
        },
      ]);
      return false;
    }
  }, [api]);

  function handleSave(e) {
    if (api) {
      const selected = context.pages.api.selected;
      const endpointIndex = context.nucleoid.api.findIndex(
        (endpoint) =>
          endpoint.path === selected.path &&
          endpoint.method.toLowerCase() === selected.method.toLowerCase()
      );
      if (endpointIndex !== -1) {
        context.nucleoid.api[endpointIndex]["x-nuc-action"] = e;
      }
    }

    if (functions) {
      const selected = context.get("pages.functions.selected");
      context.nucleoid.functions.find(
        (item) => item.path === selected
      ).definition = e;
    }

    if (query) {
      console.log("query");
    }
  }

  //eslint-disable-next-line
  function handleChange(e) {
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      compile();
      checkFunction();
    }, 400);
  }

  const compile = React.useCallback(() => {
    let key;

    if (api) {
      const { path, method } = context.get("pages.api.selected");
      key = path + "." + method + ".ts";
    } else {
      key = context.get("pages.functions.selected") + ".ts";
    }

    const {
      project: { id },
    } = context.nucleoid;

    if (mode === "cloud") {
      service.saveContext(id, context.nucleoid);
    } else if (mode === "local") {
      storage.set("ide", "projects", id, context.nucleoid);
    } else if (mode === "terminal") {
      console.log("Terminal mode is not supported yet.");
    }
    publish("CONTEXT_SAVED", { contextId: id, to: mode });
    publish("CONTEXT_CHANGED", {
      // TODO Optimize preparing files
      files: contextToMap(context.nucleoid).filter((item) => item.key === key),
    });
  }, [api, context, mode]);

  function handleEditorDidMount(editor, monaco) {
    window.monacoEditorInstance = editor;

    editorRef.current = { editor: editor, monaco: monaco };

    const nucFuncs = context.nucleoid.functions;

    options.globals = {};
    nucFuncs.forEach((item) => {
      const pth = monaco.Uri.from({ path: item.path });
      options.globals[item.path.split("/")[1]] = "writable";

      if (!monaco.editor.getModel(pth)) {
        monaco.editor.createModel(
          item.definition,
          item.ext === "js" ? "javascript" : "typescript",
          pth
        );
      }
    });

    checkFunction();
    publish("WIDGET_LOADED", { name: "VFSEditor" });

    if (ref) ref.current = editor;
  }

  const clearModels = useCallback(() => {
    const { monaco, editor } = editorRef?.current || {};
    const currentModel = editor?.getModel();
    const NucFunctions = context.nucleoid.functions;

    const functionModels = monaco?.editor
      .getModels()
      .filter((model) =>
        NucFunctions.some(
          (nucFunc) => model._associatedResource.path === nucFunc.path
        )
      );

    monaco?.editor.getModels().forEach((model) => {
      const isNotFunctionModel = !functionModels?.includes(model);
      const isNotCurrentModel =
        currentModel.uri.toString() !== model.uri.toString();
      if (isNotFunctionModel && isNotCurrentModel) {
        model.dispose();
      }
    });
  }, [context.nucleoid.functions, editorRef]);

  React.useEffect(() => {
    if (editorRef?.current) {
      checkFunction();
      clearModels();
    }
  }, [context, checkFunction, api, clearModels]);

  return (
    <Box sx={{ height: "100%" }}>
      <NucEditor
        defaultValue={file.code}
        path={file.path}
        onMount={handleEditorDidMount}
        onCodeEditorChange={handleChange}
        onSave={handleSave}
        ref={ref}
        options={{
          tabSize: 2,
          minimap: {
            enabled: false,
          },
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
          },
          renderLineHighlightOnlyWhenFocus: true,
        }}
      />
      {!functions && (
        <>
          <Grid
            container
            item
            sx={{
              position: "relative",
              bottom: (theme) => 3 + theme.spacing(1),
              left: (theme) => theme.spacing(1),
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <ApiAIButton />
            <AIDialog imperative editor={editorRef} page="api" />
          </Grid>
        </>
      )}
    </Box>
  );
});

function getFile(context, props) {
  const { api, functions, query } = props;
  const file = { path: "", code: "" };

  if (api) {
    const selected = context.pages.api.selected;

    if (!selected) return file;

    const apiConfig = context.nucleoid.api.find(
      (endpoint) =>
        endpoint.path === selected?.path && endpoint.method === selected?.method
    );

    if (!apiConfig) return file;

    file.path = selected?.path + selected?.method;

    file.code = apiConfig["x-nuc-action"];
  }

  if (functions) {
    const selected = context.get("pages.functions.selected");

    if (!selected) return file;

    file.path = selected;
    const functionItem = context.nucleoid.functions.find(
      (item) => item.path === selected
    );

    if (!functionItem) return file;

    file.code = functionItem.definition;
  }

  if (query) {
    console.log("query");
  }

  return file;
}

export default VFSEditor;
