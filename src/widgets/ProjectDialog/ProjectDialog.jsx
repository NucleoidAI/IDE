import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
//eslint-disable-next-line
import { DataGrid } from "@mui/x-data-grid";
import Delete from "@mui/icons-material/Delete";
import NucDialog from "../../components/core/NucDialog/NucDialog";
import React from "react";
import styles from "./styles";

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

const NewProjectScreen = ({ setScreen, handleClose }) => {
  const [open] = React.useState(false);

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
            <Button>Save</Button>
          </Grid>
          <ProgressBackDrop open={open} />
        </Grid>
      </DialogActions>
    </>
  );
};

const ListProjectsScreen = ({ handleClose }) => {
  const [open] = React.useState(false);
  const select = React.useRef();
  const [dialog, setDialog] = React.useState(false);

  const DeleteButton = ({ params, handleDelete }) => {
    return (
      <IconButton onClick={() => handleDelete(params)}>
        <Delete />
      </IconButton>
    );
  };

  const TypeButton = ({ type }) => {
    return type === "LOCAL" ? <CloudOffIcon /> : <CloudQueueIcon />;
  };

  const handleCloseDialog = () => {
    setDialog(false);
  };
  const deleteProject = () => {
    console.log(select);
  };

  const handleOpenDialog = () => {
    setDialog(true);
  };

  const columns = [
    {
      field: "name",
      headerName: "Project name",
      flex: 5,
    },
    {
      field: "type",
      headerName: "Type",
      flex: 2,
      renderCell: (params) => {
        return <TypeButton type={params.row.type} />;
      },
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      renderCell: (params) =>
        params.id !== "" ? (
          <DeleteButton
            params={params}
            handleDelete={(params) => handleOpenDialog(params)}
          />
        ) : null,
    },
  ];

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

  const rows = getProjectsFromLocalStorage();

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {" "}
        {/* Full height and flex container */}
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
            <Button variant="text">NEW PROJECT</Button>
          </Grid>
        </DialogTitle>
        <DialogContent sx={styles.content}>
          <DataGrid
            rows={rows}
            columns={columns}
            hideFooter={true}
            onRowClick={(e) => {
              select.current = e;
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
              <Button>Select</Button>
            </Grid>
          </Grid>
          <ProgressBackDrop open={open} />
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
              <Button onClick={deleteProject}>Delete</Button>
            </DialogActions>
          </Dialog>
        </DialogActions>
      </div>
    </>
  );
};

const ProgressBackDrop = ({ open }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
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
    <NucDialog
      open={true}
      handleClose={handleClose}
      maximizedDimensions={{ width: "50rem", height: "50rem" }}
      minimizedDimensions={{ width: "40rem", height: "40rem" }}
    >
      <ScreenManager handleClose={handleClose} />
    </NucDialog>
  );
};

export default ProjectDialog;
