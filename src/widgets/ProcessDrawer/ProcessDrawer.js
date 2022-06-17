import Backdrop from "@mui/material/Backdrop";
import CodeSandbox from "../../codesandbox";
import CodeSandboxDialog from "../../components/CodeSandboxDialog";
import DialogTooltip from "../../components/DialogTootip/";
import GitHubIcon from "@mui/icons-material/GitHub";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PostmanIcon from "../../icons/Postman";
import Project from "../../project";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SaveIcon from "@mui/icons-material/Save";
import Settings from "../../settings";
import SwaggerDialog from "../../components/SwaggerDialog";
import ViewListIcon from "@mui/icons-material/ViewList";
import service from "../../service";
import styles from "./styles";
import useGetProjects from "../../hooks/useGetProjects";
import useLayout from "../../hooks/useLayout";

//eslint-disable-next-line
//import { useContext } from "../../Context/providers/contextProvider";
import { useLocation } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Drawer,
  ListItem,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ProcessDrawer = () => {
  const [state, , handleGetProject] = useGetProjects();
  const [status, dispatch, getStatus] = useLayout();
  const location = useLocation();

  const [vercel, setVercel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backdrop, setBackdrop] = useState(false);

  const getStatusTask = useRef();

  const [link, setLink] = useState("");

  const auth = () => {
    setBackdrop(true);
    handleGetProject((result) => setBackdrop(false));
  };

  useEffect(() => {
    getStatus();
    clearInterval(getStatusTask.current);

    getStatusTask.current = setInterval(() => {
      if (Settings.connection) {
        getStatus();
      }
    }, 1000 * 60);

    if (location.state?.anchor === false) {
      setVercel(false);
    }
  }, [location.state]); //eslint-disable-line

  const handleCloseVercel = () => {
    setVercel(false);
  };

  const handleRun = () => {
    if (!Settings.runtime()) {
      handleRunSandbox();
    } else {
      if (Settings.runtime() === "npx") {
        handleRunApi();
      } else {
        handleRunSandbox();
      }
    }
    service.metrics().then((data) => {});
  };

  const handleRunApi = () => {
    setLoading(true);
    Settings.runtime("npx");
    service
      .openapi("start", state.get("nucleoid"))
      .then(() => {
        dispatch({ type: "SWAGGER_DIALOG", payload: { dialogStatus: true } });
        getStatus();
        setLoading(false);
      })
      .catch(() => {
        getStatus();
        setLoading(false);
      });
  };

  const handleSaveProject = () => {
    const { project, context, name } = Project.getStringify();
    setBackdrop(true);
    if (!project) {
      return handleGetProject((result) => setBackdrop(false));
    } else {
      service
        .updateProject(project, name, context)
        .then((data) => {
          setBackdrop(false);
        })
        .catch(() => {
          setBackdrop(false);
        });
    }
  };

  const handleCloseSandboxDialog = () => {
    dispatch({ type: "SANDBOX", payload: { dialogStatus: false } });
    getStatus();
  };

  const handleRunSandbox = async () => {
    const { data } = await service.openCodeSandBox(
      CodeSandbox.generateContent(state)
    );

    if (data.sandbox_id) {
      Settings.codesandbox.sandboxID(data.sandbox_id);
      Settings.url.app(`https://${data.sandbox_id}-3000.sse.codesandbox.io/`);
      Settings.url.terminal(
        `https://${data.sandbox_id}-8448.sse.codesandbox.io/`
      );
      dispatch({
        type: "SANDBOX",
        payload: { status: true, dialogStatus: true },
      });

      Settings.runtime("sandbox");
    }
  };

  const handleCloseSwaggerDialog = () => {
    dispatch({ type: "SWAGGER_DIALOG", payload: { dialogStatus: false } });
    getStatus();
  };

  const handleDownloadContext = () => {
    const myURL = window.URL || window.webkitURL;
    const file = new Blob([JSON.stringify(state.nucleoid)], {
      type: "text/plain",
    });
    setLink(myURL.createObjectURL(file));
  };

  const handleOpenDialog = () => {
    if (Settings.runtime() === "npx") {
      dispatch({
        type: "SWAGGER_DIALOG",
        payload: { dialogStatus: true },
      });
    }
    if (Settings.runtime() === "sandbox") {
      dispatch({
        type: "SANDBOX",
        payload: { status: true, dialogStatus: true },
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
          {loading ? (
            <ListItem sx={styles.listitem}>
              <CircularProgress color="inherit" size={23} />
            </ListItem>
          ) : (
            ApiButton(status, handleRun, handleRunApi, handleRunSandbox)
          )}
          <Tooltip placement="left" title="Open swagger dialog">
            <ListItem button onClick={handleOpenDialog}>
              <ViewListIcon sx={styles.listitem} />
            </ListItem>
          </Tooltip>
          <Tooltip placement="left" title="Login with GitHub">
            <ListItem button onClick={auth}>
              <GitHubIcon sx={styles.listitem} />
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
              <ImportExportIcon sx={styles.listitem} />
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
              <>
                Vercel deployment will be here soon
                <br />
              </>
            }
            handleTooltipClose={handleCloseVercel}
          >
            <Tooltip placement="left" title="Deploy project">
              <ListItem button onClick={() => setVercel(true)}>
                <RocketLaunchIcon sx={styles.listitem} />
              </ListItem>
            </Tooltip>
          </DialogTooltip>
        </Box>
        <Tooltip placement="left" title="Save project">
          <ListItem button onClick={handleSaveProject}>
            <SaveIcon sx={styles.listitem} />
          </ListItem>
        </Tooltip>
      </Drawer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CodeSandboxDialog
        open={status.sandboxDialog}
        handleCloseSandboxDialog={handleCloseSandboxDialog}
      />
      <SwaggerDialog
        open={status.swagger}
        handleClose={handleCloseSwaggerDialog}
      />

      {status.name}
    </>
  );
};

const ApiButton = (layoutStatus, handleRun, handleRunApi, handleRunSandbox) => {
  const { status } = layoutStatus;
  console.log(Settings.runtime());

  if (Settings.runtime() === "sandbox") {
    return (
      <>
        <Tooltip title="Reload project sandbox" placement="left">
          <ListItem button onClick={() => handleRunSandbox()}>
            <PlayCircleFilledIcon sx={styles.listitem} />
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
              <PlayCircleFilledIcon sx={styles.listitem} />
            </ListItem>
          </Tooltip>
        </>
      );

    case "unreachable":
      return (
        <Tooltip title="Run project" placement="left">
          <ListItem button onClick={handleRun}>
            <PlayCircleFilledIcon sx={styles.listitem} />
          </ListItem>
        </Tooltip>
      );
    default:
  }
};

export default ProcessDrawer;
