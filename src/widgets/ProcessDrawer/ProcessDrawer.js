import AlertMassage from "../../components/AlertMassage";
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
import { v4 as uuid } from "uuid";
import { Box, Drawer, ListItem } from "@mui/material";
import React, { useState } from "react";

const ProcessDrawer = () => {
  const [state] = useStore();
  const location = useLocation();
  const { pages } = state;
  const [started, setStarted] = useState(pages.started);
  const [alert, setAlert] = useState();

  const handleClose = () => {
    setAlert(false);
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
            title={<b>title</b>}
            message={<>message</>}
            handleTooltipClose={handleClose}
          >
            <ListItem
              button
              onClick={() => {
                if (!started) {
                  const nuc = state.get("nucleoid");
                  service
                    .openApiStart(nuc)
                    .then(() => {
                      if (!pages.opened) {
                        pages.opened = true;
                        window.open(Settings.url.app, "_blank").focus();
                      }
                    })
                    .catch((error) => {
                      setStarted(false);
                      setAlert(true);
                      //setAlert("Nucleoid runtime is not running");
                    });
                } else {
                  service.openApiStop().catch((error) => {
                    setStarted(false);
                    setAlert("Nucleoid runtime is not reachable");
                  });
                }

                setStarted((pages.started = !started));
              }}
            >
              {!started && <PlayCircleFilledIcon sx={styles.listitem} />}
              {started && <PauseCircleFilledIcon sx={styles.listitem} />}
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
      {alert && <AlertMassage key={uuid()} message={alert} />}
    </>
  );
};

export default ProcessDrawer;
