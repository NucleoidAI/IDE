import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React from "react";
import State from "../../state";
import styles from "./styles";
import { useContext } from "../../Context/providers/contextProvider";
import { v4 as uuid } from "uuid";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material/";
//eslint-disable-next-line
import { DataGrid } from "@mui/x-data-grid";
import Settings from "../../settings";

const NewProjectScreen = ({ setScreen, handleClose }) => {
  const projectName = React.useRef("");

  const addProject = () => {
    localStorage.setItem(
      "project#" + projectName.current,
      JSON.stringify(State.withSample())
    );
    setScreen("ListProjects");
  };

  return (
    <>
      <DialogTitle>
        <Grid
          container
          sx={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={() => setScreen("ListProjects")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">New Project</Typography>
          <Grid />
        </Grid>
      </DialogTitle>
      <DialogContent sx={styles.content}>
        <TextField
          onChange={(e) => {
            projectName.current = e.target.value;
          }}
          label="Project Name"
          variant="outlined"
          sx={{ width: "100%" }}
        />
      </DialogContent>
      <DialogActions>
        <Grid
          container
          sx={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid />
          <Grid>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={addProject}>Save</Button>
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
};

const ListProjectsScreen = ({ setScreen, handleClose }) => {
  const [, dispatch] = useContext();
  const select = React.useRef();

  React.useEffect(() => {
    // setSelect()
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Project name",
      width: 150,
      editable: true,
    },
  ];

  const projects = Object.keys(localStorage).filter(
    (item) => item.split("#")[0] === "project"
  );

  const rows = projects.map((item) => {
    return { id: uuid(), name: item.split("#")[1] };
  });

  const handleSelect = () => {
    const project = Object.keys(localStorage).find(
      (item) => item.split("#")[1] === select.current
    );
    Settings.project = project;
    localStorage.setItem("default", project);

    dispatch({
      type: "SET_PROJECT",
      payload: { project: JSON.parse(localStorage.getItem(project)) },
    });
    handleClose();
  };

  return (
    <>
      <DialogTitle>
        <Grid
          container
          sx={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Select a project</Typography>
          <Button onClick={() => setScreen("NewProject")} variant="text">
            NEW PROJECT
          </Button>
        </Grid>
      </DialogTitle>
      <DialogContent sx={styles.content}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter={true}
          onRowClick={(e) => (select.current = e.row.name)}
        />
      </DialogContent>
      <DialogActions>
        <Grid
          container
          sx={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid />
          <Grid>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSelect}>Select</Button>
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
};

const ScreenManager = ({ handleClose }) => {
  const [screen, setScreen] = React.useState("ListProjects");

  switch (screen) {
    case "ListProjects":
      return (
        <ListProjectsScreen setScreen={setScreen} handleClose={handleClose} />
      );
    case "NewProject":
      return (
        <NewProjectScreen setScreen={setScreen} handleClose={handleClose} />
      );
    default:
      return null;
  }
};

const ProjectDialog = ({ handleClose }) => {
  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth={"sm"}
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
    >
      <ScreenManager handleClose={handleClose} />
    </Dialog>
  );
};

export default ProjectDialog;
