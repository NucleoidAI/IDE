import Backdrop from "@mui/material/Backdrop";
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
import { mapToContext } from "../../utils/Parser";
import onboardDispatcher from "../../components/Onboard/onboardDispatcher";
import scheduler from "../../connectionScheduler";
import service from "../../service";
import styles from "./styles";
import theme from "../../theme";
import { useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import useService from "../../hooks/useService";
import vfs from "../../vfs";
import {
  Box,
  CircularProgress,
  Drawer,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import { publish, useEvent } from "../../hooks/useEvent";
import React, { useEffect, useState } from "react"; //eslint-disable-line

const ProcessDrawer = () => {
  const [state, , handleGetProject, saveProject] = useService();

  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));
  const location = useLocation();

  const [vercel, setVercel] = useState(false);
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

  const handleSaveProject = () => {
    setBackdrop(true);

    saveProject(() => {
      setBackdrop(false);
    });
  };

  const handleDownloadContext = () => {
    const myURL = window.URL || window.webkitURL;
    const file = new Blob([JSON.stringify(state.nucleoid)], {
      type: "text/plain",
    });
    setLink(myURL.createObjectURL(file));
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
          <ApiButton />
          <SwaggerButton />
          <Tooltip placement="left" title="Login with GitHub">
            <ListItem button onClick={auth}>
              <GitHubIcon sx={styles.listItem} />
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
              <ImportExportIcon sx={styles.listItem} />
            </ListItem>
          </Tooltip>
          <Tooltip placement="left" title="Open postman">
            <ListItem button>
              <PostmanIcon sx={styles.listItem} />
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
              <RocketLaunchIcon sx={styles.listItem} />
            </ListItem>
          </DialogTooltip>
        </Box>
        <Tooltip placement="left" title="Save project">
          <ListItem button onClick={handleSaveProject}>
            <SaveIcon sx={styles.listItem} />
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

function SwaggerButton() {
  const [runtimeConnection] = useEvent("RUNTIME_CONNECTION", {
    status: false,
    metrics: { free: 50, total: 100 },
  });

  const handleOpenSwaggerDialog = () => {
    publish("SWAGGER_DIALOG", { open: true });
  };

  return (
    <Tooltip placement="left" title="Open swagger dialog">
      <ListItem
        disabled={!runtimeConnection.status}
        button
        onClick={handleOpenSwaggerDialog}
      >
        <ViewListIcon sx={styles.listItem} />
      </ListItem>
    </Tooltip>
  );
}

function ApiButton() {
  const [state] = useService();
  const [errors] = useEvent("DIAGNOSTICS_COMPLETED", []);
  const [loading, setLoading] = useState(false);
  const runtime = Settings.runtime();

  const runSandbox = async (context) => {
    setLoading(true);

    const { data } = await service.createSandbox(context);
    setLoading(false);
    setTimeout(() => {
      if (Settings.landing().level < 2) {
        onboardDispatcher({ level: 2 });
      }
    }, 0);

    if (data.id) {
      Settings.sandbox.sandboxID(data.id);
      Settings.url.app(`https://nucleoid.com/sandbox/${data.id}/`);
      Settings.url.terminal(
        `https://nucleoid.com/sandbox/terminal/${data.id}/`
      );
      scheduler.start();
      publish("SWAGGER_DIALOG", { open: true });
    }
  };

  const runNpx = (context) => {
    setLoading(true);

    service
      .openapi("start", context)
      .then(() => {
        publish("SWAGGER_DIALOG", { open: true });
        scheduler.start();
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleRun = () => {
    const context = mapToContext(vfs.fsMap, state.get("nucleoid"));

    if (Settings.runtime() === "npx") {
      runNpx(context);
    } else {
      runSandbox(context);
    }
  };

  return (
    <>
      {loading ? (
        <ListItem name="onboardRun">
          <CircularProgress size={25} color={"secondary"} />
        </ListItem>
      ) : (
        <Tooltip title={`Load project ${runtime}`} placement="left">
          <ListItem
            name="onboardRun"
            button
            onClick={handleRun}
            onMouseEnter={(e) => {
              e.currentTarget.focus();
            }}
            disabled={errors.length > 0}
          >
            <PlayCircleFilledIcon sx={styles.listItem} />
          </ListItem>
        </Tooltip>
      )}
    </>
  );
}

export default ProcessDrawer;
