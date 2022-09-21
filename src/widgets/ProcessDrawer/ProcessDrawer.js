import Backdrop from "@mui/material/Backdrop";
import CodeSandbox from "../../codesandbox";
import DialogTooltip from "../../components/DialogTootip/";
import GitHubIcon from "@mui/icons-material/GitHub";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PostmanIcon from "../../icons/Postman";
import Project from "../../project";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SaveIcon from "@mui/icons-material/Save";
import Settings from "../../settings";
import ViewListIcon from "@mui/icons-material/ViewList";
import onboardDispatcher from "../../components/Onboard/onboardDispatcher";
import service from "../../service";
import styles from "./styles";
import theme from "../../theme";
import { useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import useService from "../../hooks/useService";
import {
  Box,
  CircularProgress,
  Drawer,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";

import { publish } from "../../hooks/useEvent";

import React, { useEffect, useState } from "react";

const ProcessDrawer = () => {
  const [state, , handleGetProject, saveProject] = useService();

  const status = {
    connected: "connected",
  };

  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));
  const location = useLocation();

  const [vercel, setVercel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backdrop, setBackdrop] = useState(false);
  const [link, setLink] = useState("");

  const auth = () => {
    setBackdrop(true);
    handleGetProject((result) => setBackdrop(false));
  };

  useEffect(() => {
    if (location.state?.anchor === false) {
      setVercel(false);
    }
  }, [location.state]); //eslint-disable-line

  const handleCloseVercel = () => {
    setVercel(false);
  };

  const handleRun = () => {
    if (!Settings.runtime()) {
      Settings.runtime("sandbox");
    }

    if (Settings.runtime() === "npx") {
      handleRunApi();
    } else {
      handleRunSandbox();
    }

    service.metrics().then((data) => {});
  };

  const handleRunApi = () => {
    setLoading(true);
    Settings.runtime("npx");
    service
      .openapi("start", state.get("nucleoid"))
      .then(() => {
        // TODO OPEN SWAGGER_DIALOG
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleSaveProject = () => {
    setBackdrop(true);

    saveProject(() => {
      setBackdrop(false);
    });
  };

  const handleRunSandbox = async () => {
    const { data } = await service.openCodeSandBox(
      CodeSandbox.generateContent(state)
    );

    setTimeout(() => {
      if (Settings.landing().level < 2) {
        onboardDispatcher({ level: 2 });
      }
      Settings.runtime("sandbox");
    }, 0);

    if (data.sandbox_id) {
      Settings.codesandbox.sandboxID(data.sandbox_id);
      Settings.url.app(`https://${data.sandbox_id}-3000.sse.codesandbox.io/`);
      Settings.url.terminal(
        `https://${data.sandbox_id}-8448.sse.codesandbox.io/`
      );

      publish("SWAGGER_DIALOG", { open: true });
    }
  };

  const handleDownloadContext = () => {
    const myURL = window.URL || window.webkitURL;
    const file = new Blob([JSON.stringify(state.nucleoid)], {
      type: "text/plain",
    });
    setLink(myURL.createObjectURL(file));
  };

  const handleOpenSwaggerDialog = () => {
    publish("SWAGGER_DIALOG", { open: true });
  };

  return (
    <>
      <Drawer
        variant="persistent"
        anchor={"right"}
        open={
          location.state?.anchor === undefined ? true : location.state?.anchor
        }
        sx={matchDownMD ? styles.drawerSmall : styles.drawer}
      >
        <Box>
          {loading ? (
            <ListItem sx={matchDownMD ? styles.listItemSmall : styles.listItem}>
              <CircularProgress color="inherit" size={23} />
            </ListItem>
          ) : (
            ApiButton(
              status,
              handleRun,
              handleRunApi,
              handleRunSandbox,
              matchDownMD
            )
          )}
          <Tooltip placement="left" title="Open swagger dialog">
            <ListItem button onClick={handleOpenSwaggerDialog}>
              <ViewListIcon
                sx={matchDownMD ? styles.listItemSmall : styles.listItem}
              />
            </ListItem>
          </Tooltip>
          <Tooltip placement="left" title="Login with GitHub">
            <ListItem button onClick={auth}>
              <GitHubIcon
                sx={matchDownMD ? styles.listItemSmall : styles.listItem}
              />
            </ListItem>
          </Tooltip>
          <Tooltip placement="left" title="Download project">
            <ListItem
              component={"a"}
              onClick={handleDownloadContext}
              href={link}
              download={Project.get().name + ".nuc.json"}
              target="_blank"
            >
              <ImportExportIcon
                sx={matchDownMD ? styles.listItemSmall : styles.listItem}
              />
            </ListItem>
          </Tooltip>
          <Tooltip placement="left" title="Open postman">
            <ListItem button>
              <PostmanIcon />
            </ListItem>
          </Tooltip>

          <DialogTooltip
            open={vercel}
            placement="left"
            title={<b>Deploy</b>}
            message={
              <Typography>
                Vercel deployment will be here soon
                <br />
              </Typography>
            }
            handleTooltipClose={handleCloseVercel}
          >
            <ListItem button onClick={() => setVercel(true)}>
              <RocketLaunchIcon
                sx={matchDownMD ? styles.listItemSmall : styles.listItem}
              />
            </ListItem>
          </DialogTooltip>
        </Box>
        <Tooltip placement="left" title="Save project">
          <ListItem button onClick={handleSaveProject}>
            <SaveIcon
              sx={matchDownMD ? styles.listItemSmall : styles.listItem}
            />
          </ListItem>
        </Tooltip>
      </Drawer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

const ApiButton = (
  status,
  handleRun,
  handleRunApi,
  handleRunSandbox,
  matchDownMD
) => {
  if (Settings.runtime() === "sandbox") {
    return (
      <>
        <Tooltip title="Reload project sandbox" placement="left">
          <ListItem name="onboardRun" button onClick={() => handleRunSandbox()}>
            <PlayCircleFilledIcon
              sx={matchDownMD ? styles.listItemSmall : styles.listItem}
            />
          </ListItem>
        </Tooltip>
      </>
    );
  }

  switch (status) {
    case "connected":
      return (
        <>
          <Tooltip title="Reload project npx" placement="left">
            <ListItem button onClick={() => handleRunApi(true)}>
              <PlayCircleFilledIcon
                sx={matchDownMD ? styles.listItemSmall : styles.listItem}
              />
            </ListItem>
          </Tooltip>
        </>
      );

    case "unreachable":
      return (
        <Tooltip name="onboardRun" title="Run project" placement="left">
          <ListItem button onClick={handleRun}>
            <PlayCircleFilledIcon
              sx={matchDownMD ? styles.listItemSmall : styles.listItem}
            />
          </ListItem>
        </Tooltip>
      );
    default:
  }
};

export default ProcessDrawer;
