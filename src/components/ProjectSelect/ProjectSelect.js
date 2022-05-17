import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ProjectDialog from "../../widgets/ProjectDialog";
import React from "react";
import project from "../../project";

import { Box, Button } from "@mui/material/";

export default function ProjectSelect() {
  const [open, setOpen] = React.useState(false);
  const handleClose = (event) => {
    setOpen(!open);
  };
console.log("hello")
  return (
    <Box sx={{ width: "100%" }}>
      <Button
        sx={{ width: "100%" }}
        variant="contained"
        onClick={() => setOpen(true)}
        endIcon={<ArrowDropDown />}
      >
        {project.get().name}
      </Button>
      {open && <ProjectDialog handleClose={handleClose} />}
    </Box>
  );
}
