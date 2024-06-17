import { DialogContent } from "@mui/material";
import NucDialog from "../core/NucDialog/NucDialog";
import { useEvent } from "@nucleoidai/react-event"; //eslint-disable-line

import React, { useEffect, useState } from "react";

const GraphDialog = () => {
  const [graphDialogOpened] = useEvent("GRAPH_DIALOG_OPENED", {
    terminalUrl: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (graphDialogOpened.terminalUrl !== "") {
      setOpen(true);
    }
  }, [graphDialogOpened]);

  return (
    <NucDialog
      open={open}
      handleClose={() => {
        setOpen(false);
      }}
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
        <iframe
          title="graph"
          width={"100%"}
          height={"100%"}
          style={{ border: "none" }}
          src={"https://nucleoid.com/ide/graph"}
        ></iframe>
      </DialogContent>
    </NucDialog>
  );
};

export default GraphDialog;
