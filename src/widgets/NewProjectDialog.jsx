import Dialog from "@mui/material/Dialog";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import State from "../state";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import { contextToMap } from "../utils/Parser";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import vfs from "../vfs";

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { storage, useStorage } from "@nucleoidjs/webstorage";
import { useCallback, useEffect, useState } from "react";

export function applyFilter({ inputData, query }) {
  if (query) {
    inputData = inputData.filter(
      (item) => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}

const ProjectList = ({
  searchQuery,
  handleSearch,
  dataFiltered,
  handleSelectedItem,
}) => {
  return (
    <>
      <Box sx={{ p: 1, my: 2, borderBottom: `solid 1px gray` }}>
        <InputBase
          data-cy="item-input"
          fullWidth={true}
          placeholder="Search Project..."
          value={searchQuery}
          onChange={handleSearch}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon variant="pageIcon" />
            </InputAdornment>
          }
          endAdornment={<></>}
          inputProps={{
            sx: { typography: "h6" },
          }}
        />
      </Box>

      <List disablePadding>
        {dataFiltered.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            handleSelectedItem={handleSelectedItem}
            searchQuery={searchQuery}
          />
        ))}
      </List>
    </>
  );
};

const ProjectListItem = ({ project, handleSelectedItem, searchQuery }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event, selectedMenuItem, projectId) => {
    if (
      selectedMenuItem === "clickaway" ||
      selectedMenuItem === "backdropClick"
    ) {
      setAnchorEl(null);
      return;
    } else {
      handleSelectedItem(selectedMenuItem, projectId);
    }
    setAnchorEl(null);
  };
  return (
    <>
      <ListItem
        secondaryAction={
          <>
            <IconButton aria-haspopup="true" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={(event) => handleClose(event, "Edit", project.id)}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={(event) => handleClose(event, "Delete", project.id)}
              >
                Delete
              </MenuItem>
            </Menu>
          </>
        }
        key={project.id}
        sx={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "transparent",
          borderBottomColor: (theme) => theme.palette.divider,
          "&:hover": {
            borderRadius: 1,
            borderColor: (theme) => theme.palette.primary.main,
            backgroundColor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.hoverOpacity
              ),
          },
        }}
      >
        <ListItemText
          primaryTypographyProps={{
            typography: "h7",
            sx: { textTransform: "capitalize" },
          }}
          primary={parse(project.name, match(project.name, searchQuery)).map(
            (part, index) => (
              <Box
                key={index}
                component="span"
                sx={{
                  color: part.highlight ? "primary.main" : "text.primary",
                }}
              >
                {part.text}
              </Box>
            )
          )}
        />
      </ListItem>
    </>
  );
};

const AddNewButton = ({ formArea, setFormArea }) => {
  return (
    formArea === "button" && (
      <DialogActions disableSpacing>
        <Button
          fullWidth={true}
          onClick={() => setFormArea("add")}
          sx={{
            width: "100%",
            fontSize: 18,
            borderRadius: 1,
            borderColor: "gray",
            borderWidth: 0.11,
            borderStyle: "solid",
            "&:hover": {
              borderRadius: 1,
              borderColor: (theme) => theme.palette.primary.main,
              backgroundColor: (theme) =>
                alpha(
                  theme.palette.primary.main,
                  theme.palette.action.hoverOpacity
                ),
            },
          }}
        >
          Add New Item
        </Button>
      </DialogActions>
    )
  );
};

const NewProjectForm = ({ formArea, setFormArea, createProject }) => {
  const [newProject, setNewProject] = React.useState({
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
      <DialogContent disableSpacing>
        <Stack
          spacing={2}
          direction={"row"}
          sx={{
            border: "0.1px solid gray",
            width: "100%",
            p: 1.5,
            borderRadius: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label="Project Name"
            variant="standard"
            value={newProject.projectName}
            onChange={handleProjectNameChange}
          />
          <FormControl sx={{ minWidth: 120, ml: 2 }} size="medium">
            <InputLabel>Template</InputLabel>
            <Select
              value={newProject.template}
              onChange={handleTemplateChange}
              variant="standard"
            >
              <MenuItem value={"sample"}>Sample</MenuItem>
              <MenuItem value={"blank"}>Blank</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={() => createProject(newProject)}>Create</Button>
          <Button onClick={() => setFormArea("button")}>Cancel</Button>
        </Stack>
      </DialogContent>
    )
  );
};

function NewProjectDialog({ handleClose, open }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [formArea, setFormArea] = useState("button");
  const [projects, setProjects] = useState([]);

  const getProjectsFromLocalStorage = () => {
    const projects = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("ide.projects.")) {
        const context = JSON.parse(localStorage.getItem(key));
        if (context.nucleoid && context.nucleoid.project) {
          projects.push(context.nucleoid.project);
        }
      }
    }
    return projects;
  };

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const dataFiltered = applyFilter({
    inputData: projects,
    query: searchQuery,
  });

  const deleteProject = (projectId) => {
    localStorage.removeItem(`ide.projects.${projectId}`);
  };

  const onMenuItemClick = (selectedMenuItem, projectId) => {
    if (selectedMenuItem === "Delete") {
      deleteProject(projectId);
    }
    if (selectedMenuItem === "Edit") {
      setFormArea(selectedMenuItem);
    }
  };

  const initVfs = (context) => {
    const files = contextToMap(context.nucleoid);
    vfs.init(files);
  };

  function createWithSampleTemplate(name) {
    const context = State.withSample();
    context.get = (prop) => State.resolve(context, prop);
    context.nucleoid.project.name = name;
    storage.set("ide", "projects", context.nucleoid.project.id, context);

    return context;
  }

  const createProject = (newProject) => {
    const { name, template } = newProject;

    if (template === "sample") {
      const context = createWithSampleTemplate(name);
      initVfs(context);
    } else if (template === "blank") {
      //initVfs(State.withBlank());
    }
    setProjects(getProjectsFromLocalStorage());
  };

  useEffect(() => {
    setProjects(getProjectsFromLocalStorage());
  }, []);
  console.log("render");
  const onDialogClose = () => {
    handleClose();
    setSearchQuery("");
    setFormArea("button");
  };

  return (
    <Dialog open={open} fullWidth={true} onClose={onDialogClose}>
      <DialogTitle
        m={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <WorkspacesIcon />
        <Typography mx={1} variant="h5">
          Projects
        </Typography>
      </DialogTitle>
      <DialogContent>
        <ProjectList
          handleSelectedItem={(selectedMenuItem, projectId) => {
            onMenuItemClick(selectedMenuItem, projectId);
          }}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          dataFiltered={dataFiltered}
        />
      </DialogContent>
      <AddNewButton formArea={formArea} setFormArea={setFormArea} />
      <NewProjectForm
        formArea={formArea}
        setFormArea={setFormArea}
        createProject={(newProject) => createProject(newProject)}
      />
    </Dialog>
  );
}

export default NewProjectDialog;
