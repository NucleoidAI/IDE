import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ProjectDialog from "../../widgets/ProjectDialog/ProjectDialog";
import React from "react";
import { useContext } from "../../context/context";

import { Box, Button, Typography } from "@mui/material/";

export default function ProjectSelect() {
  const [context] = useContext();

  const projectName = context.nucleoid.project.name;
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
        <Typography
          variant="caption"
          style={{ fontWeight: "bold", color: "#121212" }}
        >
          {projectName}
        </Typography>
      </Button>
      <ProjectDialog handleClose={handleClose} open={open} />
    </Box>
  );
}
