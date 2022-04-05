import CopyClipboard from "../../components/CopyClipboard";
import DialogTooltip from "../../components/DialogTootip/";
import GitHubIcon from "@mui/icons-material/GitHub";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PostmanIcon from "../../icons/Postman";
import SaveIcon from "@mui/icons-material/Save";
import Settings from "../../settings";
import SyncIcon from "@mui/icons-material/Sync";
import ViewListIcon from "@mui/icons-material/ViewList";
import service from "../../service";
import styles from "./styles";
import { useApiStatusStore } from "../../Context/providers/ApiStatusStoreProvider";
import { useLocation } from "react-router-dom";
import { useNucleoidStore } from "../../Context/providers/NucleoidStoreProvider";
import { Box, Drawer, ListItem } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ProcessDrawer = () => {
  const [state] = useNucleoidStore();
  const [status, dispatch] = useApiStatusStore();
  const location = useLocation();
  const [alert, setAlert] = useState(false);

  const getStatusTask = useRef();

  const defaultMetric = {
    total: 100,
    free: 1,
  };

  const getStatus = () => {
    Promise.all([service.metrics(), service.openapi()])
      .then((values) => {
        dispatch({
          type: "SET_STATUS",
          payload: {
            metrics: values[0],
            status: "connected",
            openapi: values[1].started,
          },
        });
        setAlert(false);
      })
      .catch((err) => {
        dispatch({
          type: "SET_STATUS",
          payload: {
            metrics: defaultMetric,
            status: "unreachable",
            openapi: false,
          },
        });
      });
  };

  useEffect(() => {
    getStatus();

    clearInterval(getStatusTask.current);

    getStatusTask.current = setInterval(() => {
      getStatus();
    }, 1000 * 60);

    if (location.state?.anchor === false) {
      setAlert(false);
    }
  }, [location.state]); //eslint-disable-line

  const handleClose = () => {
    setAlert(false);
  };

  const handleRunApi = (restart) => {
    if (
      (status.status !== "unreachable" && status.openapi === false) ||
      restart
    ) {
      const nuc = state.get("nucleoid");

      setAlert(false);
      service
        .openapi("start", nuc)
        .then(() => {
          window.open(Settings.url.app, "_blank").focus();
          getStatus();
          setAlert(false);
        })
        .catch(() => {
          getStatus();
          setAlert(true);
        });
    } else {
      service
        .openapi("stop")
        .then(() => {
          getStatus();
          setAlert(false);
        })
        .catch(() => {
          getStatus();
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
            {ApiButton(status, handleRunApi)}
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

const ApiButton = (layoutStatus, handleRunApi) => {
  const { status, openapi } = layoutStatus;
  switch (status) {
    case "connected":
      if (openapi) {
        return (
          <>
            <ListItem button onClick={() => handleRunApi(true)}>
              <SyncIcon sx={styles.listitem} />
            </ListItem>
            <ListItem button onClick={() => handleRunApi()}>
              <PauseCircleFilledIcon sx={styles.listitem} />
            </ListItem>
          </>
        );
      } else {
        return (
          <ListItem button onClick={() => handleRunApi()}>
            <PlayCircleFilledIcon sx={styles.listitem} />
          </ListItem>
        );
      }

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
