import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import { alpha } from "@mui/material/styles";
import { useState } from "react";

import {
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

const InlineCreationForm = ({ formArea, setFormArea, createProject }) => {
  const [newProject, setNewProject] = useState({
    name: "",
    template: "",
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
            value={newProject.template}
            onChange={handleTemplateChange}
            variant="outlined"
          >
            <MenuItem value={"sample"}>Sample</MenuItem>
            <MenuItem value={"blank"}>Blank</MenuItem>
          </Select>
        </FormControl>
        <Stack
          direction={"row"}
          spacing={1}
          width={"100%"}
          justifyContent="end"
        >
          <Fab
            variant="button"
            size="small"
            onClick={() => createProject(newProject)}
          >
            <DoneIcon
              sx={{
                color: (theme) => alpha(theme.palette.success.light, 0.5),
              }}
            />
          </Fab>
          <Fab
            variant="button"
            size="small"
            onClick={() => setFormArea("button")}
          >
            <CloseIcon
              sx={{
                color: (theme) => alpha(theme.palette.error.light, 0.5),
              }}
            />
          </Fab>
        </Stack>
      </Stack>
    )
  );
};

export default InlineCreationForm;
