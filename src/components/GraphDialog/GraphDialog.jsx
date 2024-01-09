import NucDialog from "../core/NucDialog/NucDialog";
import React from "react";
import { useEvent } from "@nucleoidjs/synapses"; //eslint-disable-line

import { Dialog, DialogContent } from "@mui/material";

const GraphDialog = () => {
  const [event, publish] = useEvent("GRAPH_DIALOG", { open: true });

  const handleClose = () => {
    publish("GRAPH_DIALOG", { open: false });
  };

  if (event.open) {
    return (
      <NucDialog
        open={true}
        handleClose={handleClose}
        title={"Graph"}
        expandedDimensions={{ width: "75rem", height: "60rem" }}
        minimizedDimensions={{ width: "65rem", height: "50rem" }}
      >
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
            src={"/ide/graph"}
          ></iframe>
        </DialogContent>
      </NucDialog>
    );
  } else {
    return null;
  }
};

export default GraphDialog;
