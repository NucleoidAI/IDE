import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ProjectDialog from "../../widgets/ProjectDialog/ProjectDialog";
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
        endIcon={<ArrowDropDown sx={{ color: "#121212" }} />}
      >
        {title}
      </Button>
      <ProjectDialog handleClose={handleClose} open={open} />
    </Box>
  );
}
