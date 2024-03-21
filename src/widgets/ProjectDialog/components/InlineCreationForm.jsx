import ActionButton from "../../../components/ActionButton/ActionButton";
import { useState } from "react";

import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

const InlineCreationForm = ({
  formArea,
  setFormArea,
  createProject,
  loading,
}) => {
  const [newProject, setNewProject] = useState({
    name: "",
    template: "sample",
  });

  const handleProjectNameChange = (event) => {
    setNewProject((prevState) => ({
      ...prevState,
      name: event.target.value,
    }));
  };

  const handleTemplateChange = (event) => {
    setNewProject((prevState) => ({
      ...prevState,
      template: event.target.value,
    }));
  };
  return (
    formArea === "add" && (
      <Stack
        direction={"row"}
        sx={{
          borderTop: `solid 1px gray`,
          width: "100%",
          p: 1.5,
          alignItems: "center",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Project Name"
          autoFocus
          label="Project Name"
          size="small"
          sx={{ width: "100%" }}
          value={newProject.projectName}
          onChange={handleProjectNameChange}
        />
        <FormControl sx={{ minWidth: 120, ml: 2 }} size="small">
          <InputLabel size="small" margin="dense">
            Template
          </InputLabel>
          <Select
            value={newProject.template || "sample"}
            onChange={handleTemplateChange}
            variant="outlined"
          >
            <MenuItem value={"sample"} selected>
              Sample
            </MenuItem>
            <MenuItem value={"blank"}>Blank</MenuItem>
          </Select>
        </FormControl>

        <Stack
          direction={"row"}
          spacing={1}
          width={"100%"}
          justifyContent="end"
        >
          {!loading ? (
            <>
              <ActionButton
                onClick={() => createProject(newProject)}
                type="done"
              />
              <ActionButton
                onClick={() => setFormArea("button")}
                type="close"
              />
            </>
          ) : (
            <CircularProgress color="error" />
          )}
        </Stack>
      </Stack>
    )
  );
};

export default InlineCreationForm;
