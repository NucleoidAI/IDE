import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ProjectDialog from "../../widgets/ProjectDialog";
import React from "react";
import project from "../../project";
import { useContext } from "../../context/context";

import { Box, Button } from "@mui/material/";

export default function ProjectSelect() {
  //eslint-disable-next-line
  const [context] = useContext();
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
        {project.get().name}
      </Button>
      {open && <ProjectDialog handleClose={handleClose} />}
    </Box>
  );
}
