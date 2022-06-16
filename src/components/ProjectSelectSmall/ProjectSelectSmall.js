import { FileOpen } from "@mui/icons-material/";
import ProjectDialog from "../../widgets/ProjectDialog";
import React from "react";

import { useContext } from "../../Context/providers/contextProvider";

import { Box, Button } from "@mui/material/";

export default function ProjectSelectSmall() {
  //eslint-disable-next-line
  const [context] = useContext();
  const [open, setOpen] = React.useState(false);
  const handleClose = (event) => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button
        variant="contained"
        color={"inherit"}
        onClick={() => setOpen(true)}
      >
        <FileOpen sx={{ color: "#323a40" }} />
      </Button>
      {open && <ProjectDialog handleClose={handleClose} />}
    </Box>
  );
}
