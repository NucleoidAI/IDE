import DeleteIcon from "@mui/icons-material/Delete";
import InlineEditForm from "./InlineEditForm";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useParams } from "react-router-dom";

import {
  Box,
  Fab,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  alpha,
} from "@mui/material";
import { useEffect, useState } from "react";

const ActionButton = ({
  selectedAction,
  selectedProjectId,
  project,
  runProject,
  deleteProject,
}) => {
  if (selectedAction === "Select" && selectedProjectId === project.id) {
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
  } else if (selectedAction === "Delete") {
    return (
      <Fab
        variant={"button"}
        size="small"
        aria-haspopup="true"
        sx={{
          bgcolor: (theme) => alpha(theme.palette.custom.error.light, 0.8),
        }}
        onClick={() => deleteProject(project.id)}
      >
        <DeleteIcon />
      </Fab>
    );
  }
};

const ProjectListItem = ({
  project,
  deleteProject,
  searchQuery,
  editProject,
  runProject,
  selectedProjectId,
  setSelectedProjectId,
}) => {
  const { id: activeProjectId } = useParams("id");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAction, setSelectedAction] = useState("default");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (selectedProjectId !== project.id) {
      setSelectedAction("default");
    }
  }, [selectedProjectId]);

  const handleClose = (selectedMenuItem) => {
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
      <InlineEditForm
        setSelectedAction={setSelectedAction}
        selectedProject={project}
        editProject={editProject}
      />
    );
  }

  const variant = () => {
    if (selectedProjectId === project.id) {
      return "select";
    } else if (activeProjectId === project.id) {
      return "current";
    }
    if (selectedAction === "Delete") {
      return "delete";
    }
    return "default";
  };

  return (
    <>
      <ListItem
        disablePadding
        key={project.id}
        variant={variant()}
        secondaryAction={
          selectedAction === "default" ? (
            <>
              <IconButton aria-haspopup="true" onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => handleClose("Edit")}>Edit</MenuItem>
                <MenuItem onClick={() => handleClose("Delete")}>
                  Delete
                </MenuItem>
              </Menu>
            </>
          ) : (
            <ActionButton
              selectedAction={selectedAction}
              selectedProjectId={selectedProjectId}
              project={project}
              runProject={runProject}
              deleteProject={deleteProject}
            />
          )
        }
      >
        <ListItemButton
          selected={selectedProjectId === project.id}
          onClick={() => {
            setSelectedAction("Select");
            setSelectedProjectId(project.id);
          }}
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

export default ProjectListItem;
