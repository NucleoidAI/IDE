import Edit from "@mui/icons-material/Edit";
import Fab from "@mui/material/Fab";
import React from "react";

const EditButton = ({ openEditDialog }) => {
  return (
    <Fab
      onClick={openEditDialog}
      size="small"
      sx={{ position: "absolute", right: 15, bottom: 15 }}
    >
      <Edit />
    </Fab>
  );
};

export default EditButton;
