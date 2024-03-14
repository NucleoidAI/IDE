import ActionButton from "../../../components/ActionButton/ActionButton";
import InlineEditForm from "./InlineEditForm";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import { useParams } from "react-router-dom";
import {
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

const SecondaryAction = ({
  setSelectedAction,
  selectedAction,
  selectedProjectId,
  project,
  runProject,
  deleteProject,
}) => {
  if (selectedAction === "Select" && selectedProjectId === project.id) {
    return <ActionButton onClick={() => runProject(project.id)} type="play" />;
  } else if (selectedAction === "Delete") {
    return (
      <Stack direction={"row"} spacing={1} width={"100%"} justifyContent="end">
        <ActionButton onClick={() => deleteProject(project.id)} type="delete" />
        <ActionButton
          onClick={() => setSelectedAction("default")}
          type="close"
        />
      </Stack>
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

  const handleClose = (event, selectedMenuItem) => {
    if (
      selectedMenuItem === "clickaway" ||
      selectedMenuItem === "backdropClick"
    ) {
      setAnchorEl(null);
      setSelectedAction("default");
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
                <MenuItem onClick={(event) => handleClose(event, "Edit")}>
                  Edit
                </MenuItem>
                <MenuItem onClick={(event) => handleClose(event, "Delete")}>
                  Delete
                </MenuItem>
              </Menu>
            </>
          ) : (
            <SecondaryAction
              selectedAction={selectedAction}
              selectedProjectId={selectedProjectId}
              project={project}
              runProject={runProject}
              deleteProject={deleteProject}
              setSelectedAction={setSelectedAction}
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
