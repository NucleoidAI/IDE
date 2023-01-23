import Backdrop from "@mui/material/Backdrop";
import { Chat } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import GitHubIcon from "@mui/icons-material/GitHub";
import LoginIcon from "@mui/icons-material/Login";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import PostmanIcon from "../../icons/Postman";
import Project from "../../project";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SaveIcon from "@mui/icons-material/Save";
import Settings from "../../settings";
import ViewListIcon from "@mui/icons-material/ViewList";
import { deepCopy } from "../../utils/DeepCopy";
import gtag from "../../gtag";
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
  ListItemButton,
  Tooltip,
} from "@mui/material";
import { publish, useEvent } from "@nucleoidjs/synapses";
import React, { useEffect, useState } from "react"; //eslint-disable-line

const ProcessDrawer = () => {
  const [state, , handleGetProject, saveProject] = useService();

  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));
  const location = useLocation();

  const [backdrop, setBackdrop] = useState(false);
  const [link, setLink] = useState("");

  const auth = () => {
    setBackdrop(true);
    handleGetProject((result) => setBackdrop(false));
  };

  const handleSaveProject = () => {
    setBackdrop(true);

    saveProject(() => {
      setBackdrop(false);
    });
  };

  const mapOpenApiPaths = (api) => {
    const tmpApi = deepCopy(api);
    Object.keys(api).forEach((resource) => {
      Object.keys(api[resource]).forEach((method) => {
        tmpApi[resource][method].responses = {
          200: {
            content: {
              "application/json": { schema: api[resource][method].response },
            },
          },
          400: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
        };

        tmpApi[resource][method].requestBody = {
          content: {
            "application/json": { schema: api[resource][method].request },
          },
        };

        delete tmpApi[resource][method].response;
        delete tmpApi[resource][method].request;
      });
    });

    return tmpApi;
  };

  const mapContextToOpenApi = (context) => {
    const openApi = {
      openapi: "3.0.1",
      info: {
        title: localStorage.getItem("name"),
        description: Settings.description(),
      },
      paths: mapOpenApiPaths(context.api),
      "x-nuc-functions": context.functions,
      components: {
        schemas: context.types,
      },
    };

    return JSON.stringify(openApi);
  };

  const handleDownloadContext = () => {
    const myURL = window.URL || window.webkitURL;
    const file = new Blob([mapContextToOpenApi(state.nucleoid)], {
      type: "text/plain",
    });
    setLink(myURL.createObjectURL(file));
  };

  const handleOpenChat = () => {
    publish("chatWindow", true);
  };

  function visible(path) {
    switch (path) {
      case "/dashboard":
        return false;
      case "/businessflow":
        return false;
      case "/api":
        return true;
      case "/functions":
        return true;
      case "/query":
        return false;
      case "/logs":
        return false;
      default:
        return false;
    }
  }

  return (
    <>
      <Drawer
        variant="persistent"
        anchor={"right"}
        open={visible(location.pathname)}
        sx={matchDownMD ? styles.drawerSmall : styles.drawer}
      >
        <Box>
          <ApiButton />
          <SwaggerButton />
          <Tooltip placement="left" title="Login with GitHub">
            <ListItemButton onClick={auth}>
              <LoginIcon sx={styles.listItem} />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="left" title="Open Postman (Coming soon)">
            <ListItemButton>
              <PostmanIcon sx={styles.listItem} />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="left" title="Deploy (Coming soon)">
            <ListItemButton>
              <RocketLaunchIcon sx={styles.listItem} />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="left" title="Download project">
            <ListItemButton
              component={"a"}
              onClick={handleDownloadContext}
              href={link}
              download={Project.get().name + ".openapi.json"}
              target="_blank"
            >
              <DownloadIcon sx={styles.listItem} />
            </ListItemButton>
          </Tooltip>
          <Tooltip placement="left" title="Save project">
            <ListItemButton onClick={handleSaveProject}>
              <SaveIcon sx={styles.listItem} />
            </ListItemButton>
          </Tooltip>
          {Settings.beta() && (
            <ListItemButton onClick={handleOpenChat}>
              <Chat sx={styles.listItem} />
            </ListItemButton>
          )}
        </Box>
        <Box>
          <Tooltip placement="left" title="Go to GitHub">
            <ListItemButton
              onClick={() =>
                window.open("https://github.com/NucleoidJS/Nucleoid", "_blank")
              }
            >
              <GitHubIcon sx={styles.listItem} />
            </ListItemButton>
          </Tooltip>
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
        <ViewListIcon sx={styles.listItem} />
      </ListItemButton>
    </Tooltip>
  );
}

function ApiButton() {
  const [state] = useService();
  const [errors] = useEvent("DIAGNOSTICS_COMPLETED", []);
  const [run] = useEvent("RUN_BUTTON_CLICKED", { status: false });
  const [loading, setLoading] = useState(false);
  const runtime = Settings.runtime();

  React.useEffect(() => {
    if (run.status) {
      publish("RUN_BUTTON_CLICKED", { status: false });
      handleRun();
    }
  }, [run.status]); //eslint-disable-line

  const runSandbox = async (context) => {
    setLoading(true);
    try {
      const { data } = await service.createSandbox(context);
      setLoading(false);
      setTimeout(() => {
        if (Settings.landing().level < 2) {
          onboardDispatcher({ level: 2 });
        }
      }, 0);

      gtag("event", "run_sandbox");

      if (data.id) {
        Settings.sandbox.sandboxID(data.id);
        Settings.url.app(`https://nucleoid.com/sandbox/${data.id}/`);
        Settings.url.terminal(
          `https://nucleoid.com/sandbox/terminal/${data.id}`
        );
        scheduler.start();
        publish("SWAGGER_DIALOG", { open: true });
      }
    } catch {
      setLoading(false);
      publish("GLOBAL_MESSAGE", {
        status: true,
        message: "There is a problem communicating the sandbox",
        severity: "info",
      });
    }
  };

  const runCustom = (context) => {
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
        publish("GLOBAL_MESSAGE", {
          status: true,
          message: "Network error",
          severity: "info",
        });
      });
  };

  const handleRun = () => {
    const context = mapToContext(vfs.fsMap, state.get("nucleoid"));
    console.debug(context, "handleRun");

    if (Settings.runtime() === "custom") {
      runCustom(context);
    } else {
      runSandbox(context);
    }
  };

  return (
    <>
      {loading ? (
        <ListItemButton name="onboardRun">
          <CircularProgress size={25} color={"secondary"} />
        </ListItemButton>
      ) : (
        <Tooltip title={`Start ${runtime}`} placement="left">
          <ListItemButton
            name="onboardRun"
            onClick={handleRun}
            onMouseEnter={(e) => {
              e.currentTarget.focus();
            }}
            disabled={errors.length > 0}
          >
            <PlayCircleFilledIcon sx={styles.listItem} />
          </ListItemButton>
        </Tooltip>
      )}
    </>
  );
}

export default ProcessDrawer;
