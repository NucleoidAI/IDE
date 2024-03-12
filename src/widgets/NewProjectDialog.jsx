import Dialog from "@mui/material/Dialog";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

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
  Modal,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { useCallback, useState } from "react";

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
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event, selectedMenuItem) => {
    if (selectedMenuItem === "clickaway") {
      return;
    } else {
      handleSelectedItem(selectedMenuItem);
    }
    setAnchorEl(null);
  };
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
                  <MenuItem onClick={(event) => handleClose(event, "Edit")}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={(event) => handleClose(event, "Delete")}>
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
              primary={parse(
                project.name,
                match(project.name, searchQuery)
              ).map((part, index) => (
                <Box
                  key={index}
                  component="span"
                  sx={{
                    color: part.highlight ? "primary.main" : "text.primary",
                  }}
                >
                  {part.text}
                </Box>
              ))}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

const AddNewButton = ({ formArea, setFormArea }) => {
  return (
    formArea === "button" && (
      <DialogActions disableSpacing>
        <Button
          fullWidth={true}
          variant="pageIcon"
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

const NewProjectForm = ({ formArea, setFormArea }) => {
  const [projectName, setProjectName] = React.useState("");
  const [template, setTemplate] = React.useState("");

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handleTemplateChange = (event) => {
    setTemplate(event.target.value);
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
            value={projectName}
            onChange={handleProjectNameChange}
          />
          <FormControl sx={{ minWidth: 120, ml: 2 }} size="medium">
            <InputLabel>Template</InputLabel>
            <Select
              value={template}
              onChange={handleTemplateChange}
              variant="standard"
            >
              <MenuItem value={"template1"}>Sample</MenuItem>
              <MenuItem value={"template2"}>Blank</MenuItem>
            </Select>
          </FormControl>
          <Button>Save</Button>
          <Button onClick={() => setFormArea("button")}>Cancel</Button>
        </Stack>
      </DialogContent>
    )
  );
};

function NewProjectDialog({ handleClose, open }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [formArea, setFormArea] = useState("button");
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
    inputData: getProjectsFromLocalStorage(),
    query: searchQuery,
  });

  const onMenuItemClick = (selectedMenuItem) => {
    console.log(selectedMenuItem);
    setFormArea(selectedMenuItem);
  };
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
          handleSelectedItem={(selectedMenuItem) => {
            onMenuItemClick(selectedMenuItem);
          }}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          dataFiltered={dataFiltered}
        />
      </DialogContent>
      <AddNewButton formArea={formArea} setFormArea={setFormArea} />
      <NewProjectForm formArea={formArea} setFormArea={setFormArea} />
    </Dialog>
  );
}

export default NewProjectDialog;
