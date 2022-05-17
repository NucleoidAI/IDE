import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import State from "../../state";
import React from "react";
import service from "../../service";
import project from "../../project";
import styles from "./styles";
import { Backdrop, CircularProgress } from "@mui/material";
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
import { Delete } from "@mui/icons-material";
//eslint-disable-next-line
import { DataGrid } from "@mui/x-data-grid";
import Settings from "../../settings";

const NewProjectScreen = ({ setScreen, handleClose }) => {
  const projectName = React.useRef("");

  const addProject = () => {
    service
      .addProject(projectName.current, JSON.stringify(State.withSample()))
      .then(({ data }) => {
        project.set(data, projectName.current, State.withSample());
        setScreen("ListProjects");
        Settings.projects.push({
          id: data,
          name: projectName.current,
          project: data,
        });
      });
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
  const [open, setOpen] = React.useState(false);
  const select = React.useRef();

 // React.useEffect(() => {}, []);

  const DeleteButton = ({ params, handleDelete }) => {
    return (
      <IconButton onClick={() => handleDelete(params)}>
        <Delete />
      </IconButton>
    );
  };

  const handleDelete = (params) => {
    console.log(project.get());
    console.log(params);
  };

  const handleSelect = () => {
    setOpen(true);
    service.getProject(select.current).then(({ data }) => {
      project.setWithoutStringify(data.project, data.name, data.context);
      dispatch({
        type: "SET_PROJECT",
        payload: { project: JSON.parse(data.context) },
      });
      handleClose();
      setOpen(false);
    });
  };

  const columns = [
    {
      field: "name",
      headerName: "Project name",
      flex: 5,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <DeleteButton params={params} handleDelete={handleDelete} />
      ),
    },
  ];

  const rows = Settings.projects.map((data) => {
    return { id: data.project, ...data };
  });

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
          // selectionModel={selected}
          onRowClick={(e) => {
            select.current = e.row.project;
            // setSelected(e.row);
          }}
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
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
