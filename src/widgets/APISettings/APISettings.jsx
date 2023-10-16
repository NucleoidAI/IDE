import EditButton from "../../components/EditButton";
import EditIcon from "@mui/icons-material/Edit";
import ParamView from "../../components/ParamView";
import Schema from "../../components/Schema";
import Security from "../../components/Security";
import SummaryForm from "../../components/SummaryForm";
import { compile } from "../../widgets/APIDialog/Context";
import styles from "./styles";
import { useContext } from "../../context/context";

import { Box, Fab, Grid, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";

function APISettings() {
  const [state, dispatch] = useContext();
  const [method, setMethod] = useState();
  const [params, setParams] = useState();
  const [summary, setSummary] = useState();
  const [request, setRequest] = useState();
  const [response, setResponse] = useState();
  const [types, setTypes] = useState();
  const [description, setDescription] = useState();

  const matchWidth = useMediaQuery("(min-width:900px)");
  const summaryRef = useRef([]);

  useEffect(() => {
    const selected = state.get("pages.api.selected");
    const api = state.get("nucleoid.api");

    if (selected) {
      const selectedApiEndpoint = api.find(
        (endpoint) =>
          endpoint.path === selected.path && endpoint.method === selected.method
      );

      if (selectedApiEndpoint) {
        setMethod(selected.method);
        setParams(selectedApiEndpoint.params || []);
        setSummary(selectedApiEndpoint.summary || "");
        setRequest(compile(selectedApiEndpoint.request || {}));
        setResponse(compile(selectedApiEndpoint.response || {}));
        setDescription(selectedApiEndpoint.description || "");

        setTypes(
          Object.entries(state.get("nucleoid.types"))
            .map(([key, value]) => ({
              ...value,
              name: key,
              type: value.type,
            }))
            .map((type) => compile(type))
        );
      }
    }
  }, [state, method]);

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
            {method === "get" && (
              <Grid container justifyContent={"center"} alignItems={"center"}>
                <Typography fontWeight={"bolder"} fontSize={"medium"}>
                  Request
                </Typography>
                <ParamView params={params} />
              </Grid>
            )}
            //TODO: decide on how to display request and response
            {/*method !== "get" && request && (
              <Schema
                key={Object.keys(request)[0]}
                request
                types={types}
                ref={request}
              />
            )*/}
          </Grid>
          <Grid item xs={6} sx={styles.schema}>
            {/*response && (
              <Schema
                key={Object.keys(response)[0]}
                response
                types={types}
                ref={response}
              />
            )*/}
          </Grid>
        </Grid>
        {!matchWidth && <EditButton openEditDialog={openEditDialog} />}
        {matchWidth && (
          <Grid container md={3} item sx={styles.summaryFormRoot}>
            <SummaryForm
              summaryText={summary}
              descriptionText={description}
              ref={summaryRef}
            />

            <Security
              onClick={() => console.log(summaryRef.current["Summary"].value)}
            />
            <Grid container sx={styles.editIcon}>
              <Fab size={"small"} onClick={openEditDialog}>
                <EditIcon />
              </Fab>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default APISettings;
