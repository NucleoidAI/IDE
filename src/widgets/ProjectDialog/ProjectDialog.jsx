import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Delete from "@mui/icons-material/Delete";
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

//eslint-disable-next-line
import { DataGrid } from "@mui/x-data-grid";

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

  const handleCloseDialog = () => {
    setDialog(false);
  };

  const handleOpenDialog = (params) => {
    select.current = params.id;
    setDialog(true);
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
        params.id !== "" ? (
          <DeleteButton
            params={params}
            handleDelete={(params) => handleOpenDialog(params)}
          />
        ) : null,
    },
  ];

  const rows = [];

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
          <Button variant="text">NEW PROJECT</Button>
        </Grid>
      </DialogTitle>
      <DialogContent sx={styles.content}>
        <DataGrid
          rows={rows}
          columns={columns}
          hideFooter={true}
          onRowClick={(e) => {
            select.current = e.row.project;
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
            <Button autoFocus>Delete</Button>
          </DialogActions>
        </Dialog>
      </DialogActions>
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
