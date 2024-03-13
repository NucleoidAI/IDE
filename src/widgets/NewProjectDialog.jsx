import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DoneIcon from "@mui/icons-material/Done";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SearchIcon from "@mui/icons-material/Search";
import State from "../state";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import { contextToMap } from "../utils/Parser";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useEvent } from "@nucleoidjs/react-event";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router";
import vfs from "../vfs";

import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import React, { useRef } from "react";
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
  const [loading, setLoading] = useState(false);
  const [vfsInit] = useEvent("DIAGNOSTICS_COMPLETED", { loading: true });
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);
  }, [vfsInit]);

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
    setProjects(getProjectsFromLocalStorage());
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
    setLoading(true);

    if (template === "sample") {
      const context = createWithSampleTemplate(name);
      initVfs(context);
    } else if (template === "blank") {
      //initVfs(State.withBlank());
    }
    setProjects(getProjectsFromLocalStorage());
    setFormArea("button");
  };

  useEffect(() => {
    setProjects(getProjectsFromLocalStorage());
  }, []);

  const editProject = (editedProjectName, editedProjectId) => {
    setLoading(true);
    const context = storage.get("ide", "projects", editedProjectId);
    context.nucleoid.project.name = editedProjectName;
    storage.remove("ide", "projects", editedProjectId);
    //PUBLISH CONTEXT CHANGED EVENT
    initVfs(context);
    storage.set("ide", "projects", editedProjectId, context);
    setProjects(getProjectsFromLocalStorage());
  };

  const runProject = (projectId) => {
    //TODO Remove mode
    navigate(`/${projectId}/api?mode=local`);
    navigate(0);
  };

  const onDialogClose = () => {
    handleClose();
    setSearchQuery("");
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
          loading={loading}
          runProject={(projectId) => runProject(projectId)}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          dataFiltered={dataFiltered}
          editProject={(editedProjectName, editedProjectId) =>
            editProject(editedProjectName, editedProjectId)
          }
          deleteProject={(projectId) => deleteProject(projectId)}
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

const ProjectList = ({
  loading,
  searchQuery,
  handleSearch,
  dataFiltered,
  handleSelectedItem,
  editProject,
  deleteProject,
  runProject,
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
            runProject={runProject}
            loading={loading}
            deleteProject={deleteProject}
            key={project.id}
            project={project}
            handleSelectedItem={handleSelectedItem}
            searchQuery={searchQuery}
            editProject={editProject}
          />
        ))}
      </List>
    </>
  );
};

const ProjectEditItem = ({
  selectedProject,
  editProject,
  setSelectedAction,
}) => {
  const [projectToEdit, setProjectToEdit] = React.useState({
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
        borderStyle: "solid",

        borderRadius: 1,
        borderColor: (theme) => theme.palette.primary.main,
        backgroundColor: (theme) =>
          alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
      }}
    >
      <TextField
        variant="outlined"
        autoFocus
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
          onClick={() =>
            editProject(projectToEdit.projectName, projectToEdit.id)
          }
        >
          <DoneIcon />
        </Fab>
        <Fab
          variant="button"
          size="small"
          onClick={() => setSelectedAction("")}
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

const ProjectListItem = ({
  loading,
  project,
  deleteProject,
  searchQuery,
  editProject,
  runProject,
}) => {
  const { id: activeProjectId } = useParams("id");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedAction, setSelectedAction] = useState("");
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    !loading && setSelectedAction("");
  }, [loading]);

  const handleClose = (event, selectedMenuItem) => {
    if (
      selectedMenuItem === "clickaway" ||
      selectedMenuItem === "backdropClick"
    ) {
      setAnchorEl(null);
      return;
    } else {
      setSelectedAction(selectedMenuItem);
    }
    setAnchorEl(null);
  };

  if (selectedAction === "Edit") {
    return (
      <ProjectEditItem
        setSelectedAction={setSelectedAction}
        selectedProject={project}
        editProject={editProject}
        loading={loading}
      />
    );
  }

  return (
    <>
      <ListItem
        disablePadding
        secondaryAction={(() => {
          switch (selectedAction) {
            case "Select":
              return (
                <Fab
                  variant={"button"}
                  size="small"
                  aria-haspopup="true"
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.light, 0.8),
                  }}
                  onClick={() => runProject(project.id)}
                >
                  <PlayArrowIcon />
                </Fab>
              );
            case "Delete":
              return (
                <Fab
                  variant={"button"}
                  size="small"
                  aria-haspopup="true"
                  sx={{
                    bgcolor: (theme) =>
                      alpha(theme.palette.custom.error.light, 0.8),
                  }}
                  onClick={() => deleteProject(project.id)}
                >
                  <DeleteIcon />
                </Fab>
              );
            default:
              return (
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
                      onClick={(event) =>
                        handleClose(event, "Edit", project.id)
                      }
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={(event) =>
                        handleClose(event, "Delete", project.id)
                      }
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </>
              );
          }
        })()}
        key={project.id}
        sx={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "transparent",
          ...(selectedAction === "Select"
            ? {
                borderRadius: 1,
                borderColor: (theme) => theme.palette.primary.main,
                backgroundColor: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.action.hoverOpacity
                  ),
              }
            : {}),
          ...(selectedAction === "Delete"
            ? {
                borderStyle: "solid",
                borderWidth: 1,
                borderRadius: 1,
                borderColor: (theme) => theme.palette.custom.error.light,
                backgroundColor: (theme) =>
                  alpha(
                    theme.palette.custom.error.main,
                    theme.palette.action.hoverOpacity
                  ),
              }
            : {}),
          ...(project.id === activeProjectId || selectedAction === "Select"
            ? {
                borderRadius: 1,
                backgroundColor: (theme) =>
                  selectedAction === "Select"
                    ? alpha(theme.palette.primary.main, 0.8)
                    : alpha(theme.palette.primary.main, 0.4),
              }
            : selectedAction === ""
            ? {
                "&:hover": {
                  borderRadius: 1,
                  borderColor: (theme) => theme.palette.primary.main,
                  backgroundColor: (theme) =>
                    alpha(
                      theme.palette.primary.main,
                      theme.palette.action.hoverOpacity
                    ),
                },
              }
            : {}),
        }}
      >
        <ListItemButton
          onClick={() => setSelectedAction("Select")}
          variant="transparent"
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
        </ListItemButton>
      </ListItem>
    </>
  );
};

export default NewProjectDialog;
