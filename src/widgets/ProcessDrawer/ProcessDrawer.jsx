import Backdrop from "@mui/material/Backdrop";
import { Chat } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import GitHubIcon from "@mui/icons-material/GitHub";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import RefreshIcon from "@mui/icons-material/Refresh";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SaveIcon from "@mui/icons-material/Save";
import SchoolIcon from "@mui/icons-material/School";
import Settings from "../../settings";
import ViewListIcon from "@mui/icons-material/ViewList";
import { deepCopy } from "../../utils/DeepCopy";
import { getTypes } from "../../lib/TypeScript";
import gtag from "../../gtag";
import { mapToContext } from "../../utils/Parser";
import onboardDispatcher from "../../components/Onboard/onboardDispatcher";
import scheduler from "../../connectionScheduler";
import service from "../../service";
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
  const [state] = useContext();

  const [backdrop] = useState(false);
  const [link, setLink] = useState("");

  const handleSaveProject = () => {};

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
        // TODO : change title with project name
        title: "",
        description: Settings.description(),
      },
      paths: mapOpenApiPaths(context.api),
      "x-nuc-functions": context.functions,
      components: {
        schemas: context.types,
      },
    };
    return (
      Settings.beta()
        ? JSON.stringify({
            functions: context.functions,
            api: context.api,
            types: context.types,
          })
        : JSON.stringify(openApi)
    )
      .replace(/\\n/g, " ")
      .replace(/ +/g, " ");
  };

  const handleDownloadContext = () => {
    const myURL = window.URL || window.webkitURL;

    const file = new Blob([mapContextToOpenApi(state.nucleoid)], {
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
              // TODO : change with projectname
              download={"nuc.openapi.json"}
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
          <Tooltip placement="left" title="Go to GitHub">
            <ListItemButton
              onClick={() =>
                window.open("https://github.com/NucleoidJS/Nucleoid", "_blank")
              }
            >
              <GitHubIcon variant="pageIcon" />
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
  const [state] = useContext();

  React.useEffect(() => {
    if (run.status) {
      publish("RUN_BUTTON_CLICKED", { status: false });
      handleRun();
    }
  }, [run.status]); //eslint-disable-line

  const runSandbox = async (context) => {
    const types = [...(context?.types || []), ...getTypes(context?.functions)];

    setLoading(true);
    try {
      const openapi = {
        openapi: {
          ...toOpenApi({ api: context.api, types }),
          functions: context.functions,
        },
      };
      console.log(openapi);
      const { data } = await service.createSandbox(openapi);
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

  const runCustom = (context, originalContext) => {
    setLoading(true);
    const types = [...(context?.types || []), ...getTypes(originalContext)];
    const openapi = {
      openapi: "3.0.1",
      info: {
        title: "nucleoid",
        description: Settings.description(),
      },
      ...toOpenApi({ api: context.api, types }),
    };
    openapi["x-nuc-functions"] = context.functions;
    openapi["x-nuc-action"] = "start";
    openapi["x-nuc-prefix"] = "";

    service
      .openapi(openapi)
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
    const context = mapToContext(vfs.fsMap, deepCopy(state.get("nucleoid")));
    if (Settings.runtime() === "custom") {
      runCustom(context, state.get("nucleoid.functions"));
    } else {
      runSandbox(context, state.get("nucleoid"));
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
            <PlayCircleFilledIcon variant="pageIcon" />
          </ListItemButton>
        </Tooltip>
      )}
    </>
  );
}

export default ProcessDrawer;
