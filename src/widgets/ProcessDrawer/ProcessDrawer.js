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
import { useLocation } from "react-router-dom";
import { useStore } from "../../store";
import { Box, CircularProgress, Drawer, ListItem } from "@mui/material";
import React, { useState } from "react";

const ProcessDrawer = () => {
  const [state] = useStore();
  const location = useLocation();
  const { pages } = state;
  const [started, setStarted] = useState(pages.started);
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setAlert(false);
  };

  console.log(pages);

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
            <ListItem
              button
              onClick={() => {
                if (!started) {
                  const nuc = state.get("nucleoid");
                  setLoading(true);
                  setAlert(false);
                  service
                    .openApiStart(nuc)
                    .then(() => {
                      if (!pages.opened) {
                        pages.opened = true;
                        window.open(Settings.url.app, "_blank").focus();
                        setAlert(false);

                        setLoading(false);
                      }
                    })
                    .catch((error) => {
                      setStarted(false);
                      setLoading(false);
                      setAlert(true);
                    });
                } else {
                  service.openApiStop().catch((error) => {
                    setLoading(false);
                    setStarted(false);
                    setAlert(true);
                  });
                }

                setStarted((pages.started = !started));
              }}
            >
              {loading ? (
                <CircularProgress
                  size={25}
                  color="inherit"
                  sx={{ width: 100 }}
                />
              ) : !started ? (
                <PlayCircleFilledIcon sx={styles.listitem} />
              ) : (
                started && <PauseCircleFilledIcon sx={styles.listitem} />
              )}
            </ListItem>
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
    </>
  );
};

export default ProcessDrawer;
