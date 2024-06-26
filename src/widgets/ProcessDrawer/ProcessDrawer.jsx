import Backdrop from "@mui/material/Backdrop";
import { Chat } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import GitHubIcon from "@mui/icons-material/GitHub";
import Path from "../../utils/Path";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import RefreshIcon from "@mui/icons-material/Refresh";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SaveIcon from "@mui/icons-material/Save";
import SchoolIcon from "@mui/icons-material/School";
import Settings from "../../settings";
import TryIcon from "@mui/icons-material/Try";
import ViewListIcon from "@mui/icons-material/ViewList";
import { deepCopy } from "../../utils/DeepCopy";
import { getTypes } from "../../lib/TypeScript";
import gtag from "../../gtag";
import { mapToContext } from "../../utils/Parser";
import sandboxService from "../../sandboxService";
import { toOpenApi } from "../../adapters/openapi/adapter";
import { useContext } from "../../context/context";
import { useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import vfs from "../../vfs";

import {
  Box,
  CircularProgress,
  Drawer,
  ListItemButton,
  Tooltip,
} from "@mui/material";
import React, { useState } from "react"; //eslint-disable-line
import { publish, useEvent } from "@nucleoidai/react-event";

const ProcessDrawer = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  const location = useLocation();
  const [ReactContext] = useContext();
  const { project, specification } = ReactContext;

  const [backdrop] = useState(false);
  const [link, setLink] = useState("");

  const handleSaveProject = () => {};

  const handleDownloadContext = () => {
    const myURL = window.URL || window.webkitURL;
    const download = JSON.stringify({ project, specification });
    console.log(download);

    const file = new Blob([download], {
      type: "text/plain",
    });

    setLink(myURL.createObjectURL(file));
  };

  const handleOpenChat = () => {
    publish("CHAT_WINDOW", true);
  };

  function visible(path) {
    switch (path.split("/")[2]) {
      case "api":
        return true;
      case "functions":
        return true;
      case "logic":
        return true;
      case "query":
        return false;
      case "logs":
        return false;
      default:
        return false;
    }
  }
  // TODO Collapse all [TYPE]_DRAWER_OPENED to DRAWER_OPENED and send drawer type as event payload
  return (
    <>
      <Drawer
        variant="persistent"
        anchor={"right"}
        open={visible(location?.pathname)}
        sx={matchDownMD ? theme.custom.drawerSmall : theme.custom.drawer}
      >
        <Box>
          <ApiButton />
          <Tooltip placement="left" title="Go to GitHub">
            <ListItemButton
              onClick={() =>
                window.open("https://github.com/NucleoidAI/Nucleoid", "_blank")
              }
            >
              <GitHubIcon variant="pageIcon" />
            </ListItemButton>
          </Tooltip>
          <SwaggerButton />
          <Tooltip placement="left" title="Open Nucleoid Education">
            <ListItemButton
              onClick={() => publish("EDUCATION_DRAWER_OPENED", true)}
            >
              <SchoolIcon variant="pageIcon" />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="left" title="Deploy (Coming soon)">
            <ListItemButton>
              <RocketLaunchIcon variant="pageIcon" />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="left" title="Download project">
            <ListItemButton
              component={"a"}
              onClick={handleDownloadContext}
              href={link}
              download={`${project.id}.nuc.json`}
              target="_blank"
            >
              <DownloadIcon variant="pageIcon" />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="left" title="Save project">
            <ListItemButton onClick={handleSaveProject}>
              <SaveIcon variant="pageIcon" />
            </ListItemButton>
          </Tooltip>
          {Settings.beta() && (
            <ListItemButton onClick={handleOpenChat}>
              <Chat variant="pageIcon" />
            </ListItemButton>
          )}
        </Box>
        <Box>
          <Tooltip placement="left" title="Chat">
            <ListItemButton
              data-cy="side-chat-button"
              onClick={() => publish("CHAT_DRAWER_OPENED", true)}
            >
              <TryIcon variant="pageIcon" />
            </ListItemButton>
          </Tooltip>
          {Settings.debug() && (
            <Tooltip
              placement="left"
              title="Reset and Refresh"
              sx={{ color: "red" }}
            >
              <ListItemButton
                sx={{ color: "red" }}
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                <RefreshIcon color="error" />
              </ListItemButton>
            </Tooltip>
          )}
        </Box>
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
  });

  const handleOpenSwaggerDialog = () => {
    publish("SWAGGER_DIALOG", { open: true });
  };

  return (
    <Tooltip placement="left" title="Open Swagger">
      <ListItemButton
        disabled={!runtimeConnection.status}
        onClick={handleOpenSwaggerDialog}
      >
        <ViewListIcon variant="pageIcon" />
      </ListItemButton>
    </Tooltip>
  );
}

function ApiButton() {
  const [errors] = useEvent("DIAGNOSTICS_COMPLETED", []);
  const [run] = useEvent("RUN_BUTTON_CLICKED", { status: false });
  const [loading, setLoading] = useState(false);
  const runtime = Settings.runtime();
  const [ReactContext] = useContext();

  React.useEffect(() => {
    if (run.status) {
      publish("RUN_BUTTON_CLICKED", { status: false });
      handleRun();
    }
  }, [run.status]); //eslint-disable-line

  const removeStaticMethods = (functions) => {
    return functions.map((func) => {
      if (func.type === "CLASS") {
        const definitionLines = func.definition.split("\n");
        const filteredLines = definitionLines.filter(
          (line) =>
            !line.includes("static filter") && !line.includes("static find")
        );
        return {
          ...func,
          definition: filteredLines.join("\n"),
        };
      }
      return func;
    });
  };

  const runSandbox = async (context, specification, runtime) => {
    const types = [
      ...(context?.types || []),
      ...getTypes(specification.functions),
    ];

    const filteredFunctions = removeStaticMethods(context.functions);

    setLoading(true);
    try {
      const openapi = toOpenApi({
        api: context.api,
        types,
        functions: filteredFunctions,
        declarations: context.declarations,
      });

      await sandboxService.createSandbox(openapi, runtime);

      setLoading(false);
      gtag("event", "run_sandbox");
      publish("SWAGGER_DIALOG", { open: true });
    } catch {
      setLoading(false);
      publish("APP_MESSAGE", {
        message: "There is a problem communicating with the sandbox",
        severity: "info",
      });
    }
  };

  const handleRun = () => {
    const context = mapToContext(
      vfs.fsMap,
      deepCopy(ReactContext.get("specification"))
    );
    runSandbox(context, ReactContext.get("specification"), Settings.runtime());
  };

  const mode = Path.getMode();

  return (
    <>
      {loading ? (
        <ListItemButton name="onboardRun">
          <CircularProgress size={25} color={"secondary"} />
        </ListItemButton>
      ) : (
        <Tooltip title={`Start ${runtime}`} placement="left">
          <ListItemButton
            data-cy="run-button"
            name="onboardRun"
            onClick={handleRun}
            onMouseEnter={(e) => {
              e.currentTarget.focus();
            }}
            disabled={mode === "terminal" || errors.length > 0}
          >
            <PlayCircleFilledIcon variant="pageIcon" />
          </ListItemButton>
        </Tooltip>
      )}
    </>
  );
}

export default ProcessDrawer;
