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
import Settings from "../../settings";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import StorageIcon from "@mui/icons-material/Storage";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ViewListIcon from "@mui/icons-material/ViewList";
import service from "../../service";
import styles from "./styles";
import { useContext } from "../../context";
import { v4 as uuid } from "uuid";
import { Box, Drawer, Grid, ListItem } from "@mui/material";
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom"; // eslint-disable-line

const list = [
  { title: "API", link: "/", icon: <SendIcon /> },
  { title: "Functions", link: "/ide/functions", icon: <FolderIcon /> },
  { title: "Query", link: "/ide/query", icon: <StorageIcon />, anchor: false },
  {
    title: "Branches",
    link: "/ide/branches",
    icon: <SettingsEthernetIcon />,
    anchor: false,
  },
  {
    title: "Logs",
    link: "/ide/logs",
    icon: <ViewCarouselIcon />,
    anchor: false,
  },
];

function IDE(props) {
  const [state] = useContext();
  const pages = state.get("pages");
  const [started, setStarted] = useState(pages.started);
  const [alert, setAlert] = useState();

  const location = useLocation();
  const { anchor } = location.state;

  console.log(location);

  return (
    <>
      <Grid sx={styles.root}>
        <Menu list={list} title="IDE" />
        <Grid sx={styles.content}>
          <Grid sx={styles.childrens}>
            <Outlet />
          </Grid>
        </Grid>
      </Grid>
      <Drawer
        variant="persistent"
        anchor={"right"}
        open={anchor === undefined ? true : anchor}
        sx={styles.drawer}
      >
        <Box>
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
                    setAlert("Nucleoid runtime is not running");
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
