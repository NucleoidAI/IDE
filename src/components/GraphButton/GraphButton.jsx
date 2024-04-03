import { Avatar } from "@mui/material";
import GraphImage from "../../images/graph.png";
import React from "react";
import { Box, Fab } from "@mui/material/";
import { publish, useEvent } from "@nucleoidai/react-event";

const GraphButton = () => {
  const [state] = useEvent("RUNTIME_CONNECTION", {
    status: false,
  });

  if (state.status) {
    return (
      <Box
        sx={{
          width: "100%",
          mt: 2,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Fab
          sx={{
            textTransform: "none",
            backgroundColor: "#2f383d",
            "&:hover": {
              backgroundColor: "#313a40",
            },
          }}
          variant={"contained"}
          onClick={() => {
            publish("GRAPH_DIALOG", { open: true });
          }}
        >
          <Avatar sx={{ p: 0.5 }} src={GraphImage} />
        </Fab>
      </Box>
    );
  } else {
    return null;
  }
};

export default GraphButton;
