import AlertMassage from "../../components/AlertMassage";
import FolderIcon from "@mui/icons-material/Folder";
import GitHubIcon from "@mui/icons-material/GitHub";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import Menu from "../../components/Menu";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PostmanIcon from "../../icons/Postman";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import Service from "../../service";
import Settings from "../../settings";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import StorageIcon from "@mui/icons-material/Storage";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ViewListIcon from "@mui/icons-material/ViewList";

import styles from "./styles";
import { useContext } from "../../context";
import { v4 as uuid } from "uuid";
import { Box, Drawer, Grid, ListItem } from "@mui/material";
import React, { useState } from "react";

const list = [
  { title: "API", link: "/ide/api", icon: <SendIcon /> },
  { title: "Functions", link: "/ide/functions", icon: <FolderIcon /> },
  { title: "Query", link: "/ide/query", icon: <StorageIcon /> },
  { title: "Branches", link: "/ide/branches", icon: <SettingsEthernetIcon /> },
  { title: "Logs", link: "/ide/logs", icon: <ViewCarouselIcon /> },
];

function IDE(props) {
  const [state] = useContext();
  const pages = state.get("pages");
  const [started, setStarted] = useState(pages.started);
  const [alert, setAlert] = useState();

  return (
    <>
      <Grid sx={styles.root}>
        <Menu list={list} title="IDE" />
        <Grid sx={styles.content}>
          <Grid sx={styles.childrens}>{props.children}</Grid>
        </Grid>
      </Grid>
      <Drawer
        variant="persistent"
        anchor={"right"}
        open={props.anchor === undefined ? true : props.anchor}
        sx={styles.drawer}
      >
        <Box>
          <ListItem
            button
            onClick={() => {
              if (!started) {
                const nuc = state.get("nucleoid");
                Service.openApiStart(nuc)
                  .then(() => {
                    if (!pages.opened) {
                      pages.opened = true;
                      window.open(Settings.url.app, "_blank").focus();
                    }
                  })
                  .catch((error) => {
                    setStarted(false);
                    setAlert("Nucleoid runtime is not running");
                  });
              } else {
                Service.openApiStop().catch((error) => {
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
}

export default IDE;
