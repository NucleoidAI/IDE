import ParamView from "../../components/ParamView";
import React from "react";
import SchemaEditor from "../../components/SchemaEditor";

import { Box, Divider, Paper, Typography } from "@mui/material";

const NewAPIBody = ({ types, api, requestSchemaRef, responseSchemaRef }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "85%",
        p: 2,
      }}
      data-cy="api-body"
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          data-cy="request-schema-editor"
        >
          {api.method === "GET" ? (
            <Box sx={{ width: "100%", height: "100%" }}>
              <ParamView params={api.params} />
            </Box>
          ) : (
            <SchemaEditor
              ref={requestSchemaRef}
              initialData={api.request ? api.request.schema : ""}
              customTypes={types}
            />
          )}
          <Typography variant="h6" gutterBottom>
            Request
          </Typography>
        </Paper>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ width: "1rem" }} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
          data-cy="response-schema-editor"
        >
          <SchemaEditor
            ref={responseSchemaRef}
            customTypes={types}
            initialData={api.response ? api.response.schema : ""}
          />
          <Typography variant="h6" gutterBottom>
            Response
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default NewAPIBody;
