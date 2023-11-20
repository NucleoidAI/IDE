import NewSchema from "./NewSchema";

import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import React, { useState } from "react";

const NewAPIBody = ({ types }) => {
  const [requestSchema, setRequestSchema] = useState(null);
  const [responseSchema, setResponseSchema] = useState(null);

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
    const buildSchemaStructure = (properties) => {
      return properties.map((prop) => {
        const propertyObject = {
          type: prop.type,
          name: prop.name,
        };
        if (prop.type === "object" || prop.type === "array") {
          propertyObject.properties = buildSchemaStructure(prop.properties);
        }
        return propertyObject;
      });
    };

    const isTopLevelCustomType = (schema) =>
      types.some((type) => type.name === schema?.type);

    const requestSavedSchema = requestSchema
      ? {
          type: requestSchema.type,
          properties: isTopLevelCustomType(requestSchema)
            ? []
            : buildSchemaStructure(requestSchema.properties),
        }
      : {};

    const responseSavedSchema = responseSchema
      ? {
          type: responseSchema.type,
          properties: isTopLevelCustomType(responseSchema)
            ? []
            : buildSchemaStructure(responseSchema.properties),
        }
      : {};

    console.log("Request:", JSON.stringify(requestSavedSchema, null, 2));
    console.log("Response:", JSON.stringify(responseSavedSchema, null, 2));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
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
          <NewSchema
            customTypes={types}
            onSchemaChange={setRequestSchema}
            initialSchema={exampleSchema}
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
          <NewSchema customTypes={types} onSchemaChange={setResponseSchema} />
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
