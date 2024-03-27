import ActionButton from "../../../components/ActionButton/ActionButton";
import { useState } from "react";

import { CircularProgress, ListItem, Stack, TextField } from "@mui/material";

const InlineEditForm = ({
  loading,
  selectedProject,
  editProject,
  setSelectedAction,
}) => {
  const [projectToEdit, setProjectToEdit] = useState({
    id: selectedProject.id,
    name: selectedProject.name,
    type: selectedProject.type,
    serviceType: selectedProject?.serviceType,
  });

  const handleProjectNameChange = (event) => {
    setProjectToEdit((prevState) => ({
      ...prevState,
      name: event.target.value,
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
        value={projectToEdit.name}
        onChange={handleProjectNameChange}
      />
      <Stack direction={"row"} spacing={1} width={"100%"} justifyContent="end">
        {!loading ? (
          <>
            <ActionButton
              onClick={() => {
                editProject(projectToEdit);
                setSelectedAction("default");
              }}
              type="done"
            />
            <ActionButton
              onClick={() => setSelectedAction("default")}
              type="close"
            />
          </>
        ) : (
          <CircularProgress />
        )}
      </Stack>
    </ListItem>
  );
};

export default InlineEditForm;
