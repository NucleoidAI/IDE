import AlertMassage from "../components/AlertMassage";
import FolderIcon from "@mui/icons-material/Folder";
import GitHubIcon from "@mui/icons-material/GitHub";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import Menu from "../components/Menu";
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PostmanIcon from "../icons/Postman";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import StorageIcon from "@mui/icons-material/Storage";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useContext } from "../context";
import { v4 as uuid } from "uuid";
import { Box, Drawer, Grid, ListItem } from "@mui/material";
import React, { useState } from "react";

const ratio = 0.6;
const height = 350;

const buttonSxProp = (theme) => ({
  fill: theme.palette.custom.grey,
  marginTop: 1 / 2,
  marginBottom: 1 / 2,
});

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
      <Grid sx={{ display: "flex" }}>
        <Menu list={list} title="IDE" />
        <Grid sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Grid sx={{ flex: 1, padding: 1 }}>{props.children}</Grid>
        </Grid>
      </Grid>
      <Drawer
        variant="persistent"
        anchor={"right"}
        open={props.anchor === undefined ? true : props.anchor}
        sx={{
          "& .MuiDrawer-paper": {
            top: (theme) =>
              (window.innerHeight * ratio) / 2 - height / 2 + theme.spacing(1),
            height,
            borderTopLeftRadius: "5px",
            borderBottomLeftRadius: "5px",
            background: "#353e48",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingTop: 1,
            paddingBottom: 1,
          },
        }}
      >
        <Box>
          <ListItem
            button
            onClick={() => {
              if (!started) {
                const nuc = state.get("nucleoid");
                fetch("http://localhost:8448", {
                  method: "POST",
                  body: `
                  let nuc=${JSON.stringify(nuc)});
                  NUC.load(nuc);
                  OpenAPI.start(nuc);
                  `,
                })
                  .then(() => {
                    if (!pages.opened) {
                      pages.opened = true;
                      window.open("http://localhost:3000", "_blank").focus();
                    }
                  })
                  .catch((error) => {
                    setStarted(false);
                    setAlert("Nucleoid runtime is not running");
                  });
              } else {
                fetch("http://localhost:8448", {
                  method: "POST",
                  body: "OpenAPI.stop()",
                }).catch((error) => {
                  setStarted(false);
                  setAlert("Nucleoid runtime is not reachable");
                });
              }

              setStarted((pages.started = !started));
            }}
          >
            {!started && <PlayCircleFilledIcon sx={buttonSxProp} />}
            {started && <PauseCircleFilledIcon sx={buttonSxProp} />}
          </ListItem>
          <ListItem button>
            <ViewListIcon sx={buttonSxProp} />
          </ListItem>
          <ListItem button>
            <GitHubIcon sx={buttonSxProp} />
          </ListItem>
          <ListItem button>
            <ImportExportIcon sx={buttonSxProp} />
          </ListItem>
          <ListItem button>
            <PostmanIcon />
          </ListItem>
        </Box>
        <ListItem button>
          <SaveIcon sx={buttonSxProp} />
        </ListItem>
      </Drawer>
      {alert && <AlertMassage key={uuid()} message={alert} />}
    </>
  );
}

export default IDE;
