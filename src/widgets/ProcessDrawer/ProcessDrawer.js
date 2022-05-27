import Backdrop from "@mui/material/Backdrop";
import CodeSandbox from "../../codesandbox";
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
import SwaggerDialog from "../../components/SwaggerDialog";
import SyncIcon from "@mui/icons-material/Sync";
import ViewListIcon from "@mui/icons-material/ViewList";
import project from "../../project";
import service from "../../service";
import styles from "./styles";
import useLayout from "../../hooks/useLayout";
//eslint-disable-next-line
import { useContext } from "../../Context/providers/contextProvider";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress, Drawer, ListItem } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ProcessDrawer = () => {
  const [state, contextDispatch] = useContext();
  const [status, dispatch, getStatus] = useLayout();
  const location = useLocation();

  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backdrop, setBackdrop] = useState(false);

  const getStatusTask = useRef();

  const [link, setLink] = useState("");

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

      auth({ code: newUrl[1] }).then(() => {
        setBackdrop(false);
        handleGetProject();
      });
    }

    handleDownloadContext();

    getStatus();
    clearInterval(getStatusTask.current);

    getStatusTask.current = setInterval(() => {
      if (Settings.connection) {
        getStatus();
      }
    }, 1000 * 60);

    if (location.state?.anchor === false) {
      setAlert(false);
    }
  }, [location.state, state]); //eslint-disable-line

  const handleCloseAlert = () => {
    setAlert(false);
  };

  const handleRun = () => {
    if (!Settings.runtime()) {
      setAlert(true);
      service.metrics().then((data) => {
        Settings.runtime("npx");
        handleRunApi();
      });
    }
  };

  const handleRunApi = () => {
    const nuc = state.get("nucleoid");
    setLoading(true);

    service
      .openapi("start", nuc)
      .then(() => {
        dispatch({ type: "SWAGGER_DIALOG", payload: { dialogStatus: true } });
        getStatus();
        setLoading(false);
        setAlert(false);
      })
      .catch(() => {
        getStatus();
        setLoading(false);
        setAlert(true);
      });
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
      Settings.url.editor(
        `https://${data.sandbox_id}-8448.sse.codesandbox.io/lint`
      );
      dispatch({
        type: "SANDBOX",
        payload: { status: true, dialogStatus: true },
      });
      Settings.runtime("sandbox");
      setAlert(false);
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
          <DialogTooltip
            open={alert}
            placement="left"
            title={<b>Runtime</b>}
            message={
              <>
                <RunCodesandbox handleRunSandbox={handleRunSandbox} />
                <br />
                Or run the following code in terminal.
                <br />
                <br />
                <CopyClipboard />
                <br />
              </>
            }
            handleTooltipClose={handleCloseAlert}
          >
            {loading ? (
              <ListItem sx={styles.listitem}>
                <CircularProgress color="inherit" size={23} />
              </ListItem>
            ) : (
              ApiButton(status, handleRun, handleRunApi, handleRunSandbox)
            )}
          </DialogTooltip>
          <ListItem button onClick={handleOpenDialog}>
            <ViewListIcon sx={styles.listitem} />
          </ListItem>
          <ListItem button onClick={handleGetProject}>
            <GitHubIcon sx={styles.listitem} />
          </ListItem>
          <ListItem
            component={"a"}
            href={link}
            download={project.get().name + ".nuc"}
            target="_blank"
          >
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
      {status.swagger && (
        <SwaggerDialog handleClose={handleCloseSwaggerDialog} />
      )}
      {status.name}
    </>
  );
};

const ApiButton = (layoutStatus, handleRun, handleRunApi, handleRunSandbox) => {
  const { status, sandbox } = layoutStatus;

  if (sandbox) {
    return (
      <>
        <ListItem button onClick={() => handleRunSandbox()}>
          <SyncIcon sx={styles.listitem} />
        </ListItem>
      </>
    );
  }

  switch (status) {
    case "connected":
      return (
        <>
          <ListItem button onClick={() => handleRunApi(true)}>
            <SyncIcon sx={styles.listitem} />
          </ListItem>
        </>
      );

    case "unreachable":
      return (
        <ListItem button onClick={handleRun}>
          <PlayCircleFilledIcon sx={styles.listitem} />
        </ListItem>
      );
    default:
  }
};

export default ProcessDrawer;
