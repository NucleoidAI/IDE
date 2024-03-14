import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { alpha } from "@mui/material/styles";
import { useState } from "react";

import { Fab, ListItem, Stack, TextField } from "@mui/material";

const InlineEditForm = ({
  selectedProject,
  editProject,
  setSelectedAction,
}) => {
  const [projectToEdit, setProjectToEdit] = useState({
    id: selectedProject.id,
    projectName: selectedProject.name,
  });

  const handleProjectNameChange = (event) => {
    setProjectToEdit((prevState) => ({
      ...prevState,
      projectName: event.target.value,
    }));
  };

  return (
    <ListItem
      sx={{
        borderWidth: 1,
      }}
    >
      <TextField
        variant="outlined"
        autoFocus
        label="Project Name"
        size="small"
        value={projectToEdit.projectName}
        onChange={handleProjectNameChange}
      />
      <Stack direction={"row"} spacing={1} width={"100%"} justifyContent="end">
        <Fab
          variant="button"
          size="small"
          sx={{
            color: (theme) => alpha(theme.palette.success.light, 0.5),
          }}
          onClick={() => {
            editProject(projectToEdit.projectName, projectToEdit.id);
            setSelectedAction("default");
          }}
        >
          <DoneIcon />
        </Fab>
        <Fab
          variant="button"
          size="small"
          onClick={() => setSelectedAction("default")}
        >
          <CloseIcon
            sx={{
              color: (theme) => alpha(theme.palette.custom.error.light, 0.5),
            }}
          />
        </Fab>
      </Stack>
    </ListItem>
  );
};

export default InlineEditForm;
