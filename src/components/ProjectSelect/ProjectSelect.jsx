import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ProjectDialog from "../../widgets/ProjectDialog";
import React from "react";

import { Box, Button } from "@mui/material/";

export default function ProjectSelect({ title }) {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Button
        sx={{ width: "100%", textTransform: "none" }}
        variant="contained"
        color={"inherit"}
        onClick={() => setOpen(true)}
        endIcon={<ArrowDropDown />}
      >
        {title}
      </Button>
      {open && <ProjectDialog handleClose={handleClose} />}
    </Box>
  );
}
