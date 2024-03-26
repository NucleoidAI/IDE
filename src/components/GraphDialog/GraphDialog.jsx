import { DialogContent } from "@mui/material";
import NucDialog from "../core/NucDialog/NucDialog";
import sandboxService from "../../sandboxService";
import { useEvent } from "@nucleoidjs/react-event";

import React, { useEffect, useState } from "react";

const GraphDialog = () => {
  const [event, publish] = useEvent("GRAPH_DIALOG", { open: false });
  const [graphUrl, setGraphUrl] = useState("");

  useEffect(() => {
    const fetchGraphUrl = async () => {
      try {
        const graphData = await sandboxService.get("graph");
        const blob = new Blob([JSON.stringify(graphData)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        setGraphUrl(url);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    if (event.open) {
      fetchGraphUrl();
    }
  }, [event.open]);

  const handleClose = () => {
    publish("GRAPH_DIALOG", { open: false });
    URL.revokeObjectURL(graphUrl);
  };

  if (event.open) {
    return (
      <NucDialog
        open={true}
        handleClose={handleClose}
        title={"Graph"}
        maximizedDimensions={{ width: "75rem", height: "60rem" }}
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
          {graphUrl && (
            <iframe
              title="graph"
              width={"100%"}
              height={"100%"}
              style={{ border: "none" }}
              src={graphUrl}
            ></iframe>
          )}
        </DialogContent>
      </NucDialog>
    );
  } else {
    return null;
  }
};

export default GraphDialog;
