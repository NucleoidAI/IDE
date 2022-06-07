import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Delete from "@mui/icons-material/Delete";
import React from "react";
import State from "../../state";
import project from "../../project";
import service from "../../service";
import styles from "./styles";
import useGetProjects from "../../hooks/useGetProjects";
import { Backdrop, CircularProgress } from "@mui/material";

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
  const [, dispatch] = useGetProjects();
  const projectName = React.useRef("");

  const addProject = () => {
    service
      .addProject(projectName.current, JSON.stringify(State.withSample()))
      .then(({ data }) => {
        Settings.projects.push({
          id: data,
          name: projectName.current,
          project: data,
        });
        project.set(data, projectName.current, State.withSample());
        dispatch({
          type: "SET_PROJECT",
          payload: { project: State.withSample() },
        });
        handleClose();
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
          sx={{ width: "100%", marginTop: 1 }}
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
  const [, dispatch, handleGetProjects] = useGetProjects();
  const [open, setOpen] = React.useState(false);
  const select = React.useRef();
  const [dialog, setDialog] = React.useState(false);

  const DeleteButton = ({ params, handleDelete }) => {
    return (
      <IconButton onClick={() => handleDelete(params)}>
        <Delete />
      </IconButton>
    );
  };

  const handleDelete = () => {
    setOpen(true);
    const id = select.current;
    service.deleteProject(id).then(({ data }) => {
      Settings.projects = Settings.projects.filter(
        (item) => item.project !== id
      );
      setScreen("ListProjects");
      setOpen(false);
      setDialog(false);
    });
  };

  const handleSelect = () => {
    if (select.current) {
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
    } else {
      handleClose();
    }
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleOpenDialog = (params) => {
    select.current = params.id;
    setDialog(true);
  };

  const handleOpenNewProject = async () => {
    if (project.get().project !== "") {
      setScreen("NewProject");
    } else {
      setOpen(true);
      handleGetProjects((result) => {
        if (result) setScreen("NewProject");
        setOpen(false);
      });
    }
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
      renderCell: (params) =>
        params.id !== project.get().project ? (
          <DeleteButton
            params={params}
            handleDelete={(params) => handleOpenDialog(params)}
          />
        ) : null,
    },
  ];

  const rows =
    Settings.projects.length > 0
      ? Settings.projects.map((data) => {
          return { id: data.project, ...data };
        })
      : [{ id: "", name: "SAMPLE" }];

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
          <Button onClick={handleOpenNewProject} variant="text">
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
        <Dialog
          open={dialog}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            Delete resource
          </DialogTitle>
          <DialogContent>The selected project will be deleted.</DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleDelete} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
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
