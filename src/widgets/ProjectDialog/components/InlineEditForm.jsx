import ActionButton from "../../../components/ActionButton/ActionButton";
import { useState } from "react";

import { ListItem, Stack, TextField } from "@mui/material";

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
        <ActionButton
          onClick={() => {
            editProject(projectToEdit.projectName, projectToEdit.id);
            setSelectedAction("default");
          }}
          type="done"
        />
        <ActionButton
          onClick={() => setSelectedAction("default")}
          type="close"
        />
      </Stack>
    </ListItem>
  );
};

export default InlineEditForm;
