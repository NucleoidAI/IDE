import SchemaEditor from "../../components/SchemaEditor";

import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import React, { useRef } from "react";

const NewAPIBody = ({ types }) => {
  const requestSchema = useRef();
  const responseSchema = useRef();

  const exampleSchema = {
    type: "object",
    properties: [
      {
        type: "string",
        name: "initial",
      },
      {
        type: "integer",
        name: "schema",
      },
      {
        type: "object",
        name: "object",
        properties: [
          {
            type: "integer",
            name: "nested",
          },
        ],
      },
    ],
  };

  const handleSave = () => {
    console.log(
      "Request:",
      JSON.stringify(requestSchema.current.schemaOutput(), null, 2)
    );
    console.log(
      "Response:",
      JSON.stringify(responseSchema.current.schemaOutput(), null, 2)
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "85%",
        p: 2,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            width: "100%",
            p: 2,
            borderColor: "grey.300",
            borderWidth: 1,
            borderRadius: 2,
            borderStyle: "solid",
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SchemaEditor
            ref={requestSchema}
            initialData={exampleSchema}
            customTypes={types}
          />
          <Typography variant="h6" gutterBottom>
            Request
          </Typography>
        </Paper>
      </Box>
      <Divider orientation="vertical" flexItem />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            width: "100%",
            borderColor: "grey.300",
            p: 2,
            borderWidth: 1,
            borderRadius: 2,
            borderStyle: "solid",
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SchemaEditor ref={responseSchema} customTypes={types} />
          <Typography variant="h6" gutterBottom>
            Response
          </Typography>
        </Paper>
      </Box>
      <Button variant="outlined" onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
};

export default NewAPIBody;
