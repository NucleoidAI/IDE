import CopyClipboard from "../../components/CopyClipboard";
import DialogTooltip from "../../components/DialogTootip/";
import GitHubIcon from "@mui/icons-material/GitHub";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PostmanIcon from "../../icons/Postman";
import SaveIcon from "@mui/icons-material/Save";
import Settings from "../../settings";
import ViewListIcon from "@mui/icons-material/ViewList";
import service from "../../service";
import styles from "./styles";
import { useApiStatusStore } from "../../Context/providers/ApiStatusStoreProvider";
import { useLocation } from "react-router-dom";
import { useNucleoidStore } from "../../Context/providers/NucleoidStoreProvider";
import { Box, CircularProgress, Drawer, ListItem } from "@mui/material";
import React, { useEffect, useState } from "react";

const ProcessDrawer = () => {
  const [state] = useNucleoidStore();
  const [status, dispatch] = useApiStatusStore();
  const location = useLocation();
  const [alert, setAlert] = useState(false);
  const apiStatus = status.status;

  useEffect(() => {
    if (location.state?.anchor === false) {
      setAlert(false);
    }
  }, [location.state]);

  const handleClose = () => {
    setAlert(false);
  };

  const handleRunApi = () => {
    if (apiStatus === "disconnected" || apiStatus === "unreachable") {
      const nuc = state.get("nucleoid");
      dispatch({ type: "SET_STATUS", payload: "connecting" });
      setAlert(false);
      service
        .openApiStart(nuc)
        .then(() => {
          window.open(Settings.url.app, "_blank").focus();
          dispatch({ type: "SET_STATUS", payload: "connected" });
          setAlert(false);
        })
        .catch((error) => {
          dispatch({ type: "SET_STATUS", payload: "unreachable" });
          setAlert(true);
        });
    } else {
      service
        .openApiStop()
        .then(() => {
          dispatch({ type: "SET_STATUS", payload: "disconnected" });
          setAlert(false);
        })
        .catch((error) => {
          dispatch({ type: "SET_STATUS", payload: "unreachable" });

          setAlert(true);
        });
    }
  };

  return (
    <>
      <Drawer
        variant="persistent"
        anchor={"right"}
        open={
          location.state?.anchor === undefined ? true : location.state?.anchor
        }
        sx={styles.drawer}
      >
        <Box>
          <DialogTooltip
            open={alert}
            placement="left"
            title={<b>Runtime Status</b>}
            message={
              <>
                The nucleoid runtime is not started. Run the following code in
                terminal.
                <br />
                <CopyClipboard />
              </>
            }
            handleTooltipClose={handleClose}
          >
            {ApiButton(apiStatus, handleRunApi)}
          </DialogTooltip>
          <ListItem button>
            <ViewListIcon sx={styles.listitem} />
          </ListItem>
          <ListItem button>
            <GitHubIcon sx={styles.listitem} />
          </ListItem>
          <ListItem button>
            <ImportExportIcon sx={styles.listitem} />
          </ListItem>
          <ListItem button>
            <PostmanIcon />
          </ListItem>
        </Box>
        <ListItem button>
          <SaveIcon sx={styles.listitem} />
        </ListItem>
      </Drawer>
      {status.name}
    </>
  );
};

const ApiButton = (status, handleRunApi, handleClose, anchor) => {
  switch (status) {
    case "connected":
      return (
        <ListItem button onClick={() => handleRunApi()}>
          <PauseCircleFilledIcon sx={styles.listitem} />
        </ListItem>
      );
    case "connecting":
      return (
        <ListItem>
          <CircularProgress size={25} color="inherit" sx={{ width: 90 }} />
        </ListItem>
      );
    case "disconnected":
      return (
        <ListItem button onClick={() => handleRunApi()}>
          <PlayCircleFilledIcon sx={styles.listitem} />
        </ListItem>
      );
    case "unreachable":
      return (
        <ListItem button onClick={() => handleRunApi()}>
          <PlayCircleFilledIcon sx={styles.listitem} />
        </ListItem>
      );
    default:
  }
};

export default ProcessDrawer;
