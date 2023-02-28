import React from "react";

import { Dialog, DialogContent } from "@mui/material";
import { useEvent } from "@nucleoidjs/synapses"; //eslint-disable-line

const GraphDialog = () => {
  const [event, publish] = useEvent("GRAPH_DIALOG", { open: false });

  const handleClose = () => {
    publish("GRAPH_DIALOG", { open: false });
  };

  if (event.open) {
    return (
      <Dialog maxWidth={"xl"} open={true} onClose={handleClose}>
        <DialogContent
          sx={{
            width: "80vw",
            height: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <iframe
            title="graph"
            width={"100%"}
            height={"100%"}
            style={{ border: "none" }}
            src={"https://nucleoid.com/graph"}
          ></iframe>
        </DialogContent>
      </Dialog>
    );
  } else {
    return null;
  }
};

export default GraphDialog;
