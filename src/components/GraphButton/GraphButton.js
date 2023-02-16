import React from "react";
import SchemaIcon from "@mui/icons-material/Schema";
import { Box, Fab } from "@mui/material/";
import { publish, useEvent } from "@nucleoidjs/synapses";

const GraphButton = () => {
  const [state] = useEvent("RUNTIME_CONNECTION", {
    status: false,
  });

  if (state.status) {
    return (
      <Box
        sx={{ width: "100%", pt: 1, display: "flex", justifyContent: "center" }}
      >
        <Fab
          sx={{ textTransform: "none" }}
          variant="contained"
          color={"inherit"}
          onClick={() => {
            publish("GRAPH_DIALOG", { open: true });
          }}
        >
          <SchemaIcon />
        </Fab>
      </Box>
    );
  } else {
    return null;
  }
};

export default GraphButton;
