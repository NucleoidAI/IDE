import Backdrop from "@mui/material/Backdrop";
import CodeSandboxDialog from "../../components/CodeSandboxDialog";
import CopyClipboard from "../../components/CopyClipboard";
import DialogTooltip from "../../components/DialogTootip/";
import GitHubIcon from "@mui/icons-material/GitHub";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PostmanIcon from "../../icons/Postman";
import Project from "../../project";
import RunCodesandbox from "../../components/RunCodesandbox";
import SaveIcon from "@mui/icons-material/Save";
import Settings from "../../settings";
import SyncIcon from "@mui/icons-material/Sync";
import ViewListIcon from "@mui/icons-material/ViewList";

import project from "../../project";
import service from "../../service";
import styles from "./styles";

import { useContext } from "../../Context/providers/contextProvider";
import { useLayoutContext } from "../../Context/providers/layoutContextProvider";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress, Drawer, ListItem } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ProcessDrawer = () => {
  const [state, contextDispatch] = useContext();
  const [status, dispatch] = useLayoutContext();
  const location = useLocation();

  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backdrop, setBackdrop] = useState(false);

  const getStatusTask = useRef();

  const defaultMetric = {
    total: 100,
    free: 50,
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

  const auth = (code) => {
    return service.auth(code).then((data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      return service.getUserFromGit(data.refreshToken);
    });
  };

  useEffect(() => {
    const url = window.location.href;
    const hasCode = url.includes("?code=");

    if (hasCode) {
      const newUrl = url.split("?code=");
      window.history.pushState({}, null, newUrl[0]);
      setBackdrop(true);

      auth({ code: newUrl[1] }).then((user) => {
        setBackdrop(false);
        handleGetProject();
      });
    }

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
    setLoading(true);
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
          setLoading(false);
          setAlert(false);
        })
        .catch(() => {
          getStatus();
          setLoading(false);
          setAlert(true);
        });
    } else {
      service
        .openapi("stop")
        .then(() => {
          getStatus();
          setLoading(false);
          setAlert(false);
        })
        .catch(() => {
          getStatus();
          setLoading(false);
          setAlert(true);
        });
    }
  };

  const handleGetProject = () => {
    setBackdrop(true);

    service.getProjects().then((result) => {
      Settings.projects = [...result.data];

      if (result.data.length > 0) {
        service.getProject(result.data[0].project).then(({ data }) => {
          setBackdrop(false);
          project.setWithoutStringify(data.project, data.name, data.context);
          contextDispatch({
            type: "SET_PROJECT",
            payload: { project: JSON.parse(data.context) },
          });
        });
      } else {
        const { name, context } = project.getStringify();
        service.addProject(name, context).then(({ data }) => {
          Settings.projects = [{ project: data, name }];
          project.setWithoutStringify(data, name, context);
          setBackdrop(false);
        });
      }
    });
  };

  const handleSaveProject = () => {
    const { project, context, name } = Project.getStringify();
    setBackdrop(true);

    service.updateProject(project, name, context).then((data) => {
      setBackdrop(false);
    });
  };

  const handleCloseSandboxDialog = () => {
    dispatch({ type: "SANDBOX", payload: { dialogStatus: false } });
  };
  const handleOpenSandboxDialog = async () => {
    const { data } = await service.openCodeSandBox(state);
    if (data.sandbox_id) {
      Settings.codesandbox.sandbox_id = data.sandbox_id;
      Settings.url.app = `https://${data.sandbox_id}.sse.codesandbox.io/`;
      Settings.url.terminal = `https://${data.sandbox_id}-8448.sse.codesandbox.io/`;
      Settings.url.lint = `https://${data.sandbox_id}-8448.sse.codesandbox.io/lint`;
      Settings.url.editor = `https://${data.sandbox_id}-8448.sse.codesandbox.io/lint`;
      dispatch({
        type: "SANDBOX",
        payload: { status: true, dialogStatus: true },
      });
      setAlert(false);
      setTimeout(() => {
        getStatus();
      }, 5000);
    }

    // setAlert(false);
    //setOpenSandboxDialog(true);
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
                or
                <br />
                <RunCodesandbox
                  handleOpenSandboxDialog={handleOpenSandboxDialog}
                />
              </>
            }
            handleTooltipClose={handleClose}
          >
            {loading ? (
              <ListItem sx={styles.listitem}>
                <CircularProgress color="inherit" size={23} />
              </ListItem>
            ) : (
              ApiButton(status, handleRunApi, handleOpenSandboxDialog)
            )}
          </DialogTooltip>
          <ListItem button>
            <ViewListIcon sx={styles.listitem} />
          </ListItem>
          <ListItem button onClick={handleGetProject}>
            <GitHubIcon sx={styles.listitem} />
          </ListItem>
          <ListItem button>
            <ImportExportIcon sx={styles.listitem} />
          </ListItem>
          <ListItem button>
            <PostmanIcon />
          </ListItem>
        </Box>
        <ListItem button onClick={handleSaveProject}>
          <SaveIcon sx={styles.listitem} />
        </ListItem>
      </Drawer>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {status.sandboxDialog && (
        <CodeSandboxDialog
          handleCloseSandboxDialog={handleCloseSandboxDialog}
        />
      )}
      {status.name}
    </>
  );
};

const ApiButton = (layoutStatus, handleRunApi, handleOpenSandboxDialog) => {
  const { status, sandbox } = layoutStatus;

  switch (status) {
    case "connected":
      return (
        <>
          <ListItem
            button
            onClick={() =>
              sandbox ? handleOpenSandboxDialog() : handleRunApi(true)
            }
          >
            <SyncIcon sx={styles.listitem} />
          </ListItem>
        </>
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
