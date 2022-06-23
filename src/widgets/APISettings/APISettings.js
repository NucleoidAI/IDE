import EditIcon from "@mui/icons-material/Edit";
import ParamView from "../../components/ParamView";
import Schema from "../../components/Schema";
import Security from "../../components/Security";
import SummaryForm from "../../components/SummaryForm";
import { compile } from "../../widgets/APIDialog/Context";
import styles from "./styles";
import { useContext } from "../../Context/providers/contextProvider";
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
  console.log(matchWidth);
  const summaryRef = useRef([]);

  useEffect(() => {
    const selected = state.get("pages.api.selected");
    const api = state.get("nucleoid.api");

    if (selected) {
      setMethod(selected.method);
      setParams(api[selected.path][selected.method].params);
      setSummary(api[selected.path][selected.method].summary);
      setRequest(compile(api[selected.path][selected.method].request));
      setResponse(compile(api[selected.path][selected.method].response));
      setDescription(api[selected.path][selected.method].description);

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
  }, [state, method]);

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
            {method !== "get" && request && (
              <Schema
                key={Object.keys(request)[0]}
                request
                types={types}
                ref={request}
              />
            )}
          </Grid>
          <Grid item xs={6} sx={styles.schema}>
            {response && (
              <Schema
                key={Object.keys(response)[0]}
                response
                types={types}
                ref={response}
              />
            )}
          </Grid>
        </Grid>
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
              <Fab
                size={"small"}
                onClick={() => {
                  dispatch({
                    type: "OPEN_API_DIALOG",
                    payload: { type: "method", action: "edit" },
                  });
                }}
              >
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
