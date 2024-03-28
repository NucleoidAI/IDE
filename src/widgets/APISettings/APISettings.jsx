/* eslint-disable */
import EditIcon from "@mui/icons-material/Edit";
import ParamView from "../../components/ParamView";
import Schema from "../../components/Schema/Schema";
import Security from "../../components/Security";
import SummaryForm from "../../components/SummaryForm";
import { compile } from "../../widgets/APIDialog/Context";
import { getTypes } from "../../lib/TypeScript";
import styles from "./styles";
import { useContext } from "../../context/context";

import { Box, Fab, Grid, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";

function APISettings() {
  const [state, dispatch] = useContext();
  const [selectedApi, setSelectedApi] = useState({});
  const [method, setMethod] = useState();
  const [params, setParams] = useState();
  const [summary, setSummary] = useState();
  const [request, setRequest] = useState();
  const [response, setResponse] = useState();
  const [types, setTypes] = useState();
  const [description, setDescription] = useState();

  const matchWidth = useMediaQuery("(min-width:900px)");
  const summaryRef = useRef([]);
  let customTypes = [];

  useEffect(() => {
    const selected = state.get("pages.api.selected");
    const contextApis = state.nucleoid.api;

    let selectApi = null;

    if (Array.isArray(contextApis)) {
      selectApi = contextApis.find(
        (api) => api.path === selected?.path && api.method === selected.method
      );
    }

    const tsTypes = getTypes(state.get("nucleoid.functions"));
    const nucTypes = state.get.nucleoid?.types;

    if (Array.isArray(nucTypes)) {
      customTypes = [...nucTypes, ...tsTypes];
    } else {
      customTypes = [...tsTypes];
    }

    const api = state.get("nucleoid.api");

    if (selected) {
      const selectedApiEndpoint = api.find(
        (endpoint) =>
          endpoint.path === selected.path && endpoint.method === selected.method
      );

      if (selectedApiEndpoint) {
        setSelectedApi(selectApi);
        setMethod(selectApi.method);
        setParams(selectedApiEndpoint.params || []);
        setSummary(selectApi.summary || "");
        setRequest(selectApi.request?.schema || {});
        setResponse(selectedApi.response?.schema || {});
        setDescription(selectApi.description || "");

        setTypes(
          state.get("nucleoid.types").map((typeObject) => {
            return compile(typeObject);
          })
        );
      }
    }
  }, [state, method]);

  const handleSummaryChange = (newSummary) => {
    dispatch({
      type: "UPDATE_API_SUMMARY",
      payload: {
        path: selectedApi.path,
        method: selectedApi.method,
        newSummary,
      },
    });
  };

  const handleDescriptionChange = (newDescription) => {
    dispatch({
      type: "UPDATE_API_DESCRIPTION",
      payload: {
        path: selectedApi.path,
        method: selectedApi.method,
        newDescription,
      },
    });
  };

  const openEditDialog = () => {
    dispatch({
      type: "OPEN_API_DIALOG",
      payload: { type: "method", action: "edit" },
    });
  };

  return (
    <Box sx={styles.root}>
      <Grid container sx={styles.container} spacing={1}>
        <Grid
          container
          md={matchWidth ? 9 : 12}
          item
          sx={styles.content}
          spacing={1}
        >
          <Grid item xs={6} sx={styles.schema}>
            <Grid container justifyContent={"center"} alignItems={"center"}>
              <Typography fontWeight={"bolder"} fontSize={"medium"}>
                Request
              </Typography>
            </Grid>

            {/*method !== "get" && request && (
              <Schema
                key={Object.keys(request)[0]}
                request
                types={types}
                ref={request}
              />
            )*/}
            {selectedApi.request && (
              <Schema initialData={request} customTypes={customTypes} />
            )}
          </Grid>
          <Grid item xs={6} sx={styles.schema}>
            <Grid container justifyContent={"center"} alignItems={"center"}>
              <Typography fontWeight={"bolder"} fontSize={"medium"}>
                Response
              </Typography>
            </Grid>
            {/*response && (
              <Schema
                key={Object.keys(response)[0]}
                response
                types={types}
                ref={response}
              />
            )*/}
            {selectedApi.response && (
              <Schema initialData={response} customTypes={customTypes} />
            )}
          </Grid>
        </Grid>

        {!matchWidth && (
          <Fab
            variant="button"
            size={"small"}
            onClick={openEditDialog}
            sx={{ position: "absolute", right: 15, bottom: 15 }}
          >
            <EditIcon />
          </Fab>
        )}
        {matchWidth && (
          <Grid container md={3} item sx={styles.summaryFormRoot}>
            <SummaryForm
              summary={selectedApi.summary}
              description={selectedApi.description}
              onSummaryChange={handleSummaryChange}
              onDescriptionChange={handleDescriptionChange}
              ref={summaryRef}
            />

            <Security
              onClick={() => console.log(summaryRef.current["Summary"].value)}
            />
            <Grid container sx={styles.editIcon}>
              {selectedApi && Object.keys(selectedApi).length > 0 && (
                <Fab variant="button" size={"small"} onClick={openEditDialog}>
                  <EditIcon />
                </Fab>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default APISettings;
/* eslint-disable */
