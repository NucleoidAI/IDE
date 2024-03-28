import { Box } from "@mui/material";
import ContextProvider from "../../context/context";
import EducationDrawer from "../../components/EducationDrawer/EducationDrawer";
import GraphDialog from "../../components/GraphDialog/GraphDialog";
import Menu from "../../widgets/Menu";
import Onboard from "../../components/Onboard";
import { Outlet } from "react-router-dom"; // eslint-disable-line
import Path from "../../utils/Path";
import PopChat from "../../widgets/PopChat";
import ProcessDrawer from "../../widgets/ProcessDrawer/ProcessDrawer";
import Settings from "../../settings";
import State from "../../state";
import SwaggerDialog from "../../components/SwaggerDialog";
import { contextReducer } from "../../context/reducer";
import { contextToMap } from "../../utils/Parser";
import routes from "../../routes";
import service from "../../service";
import { storage } from "@nucleoidjs/webstorage";
import styles from "./styles";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import vfs from "../../vfs";

import React, { useEffect } from "react";
import { publish, useEvent } from "@nucleoidai/react-event";
import { useMediaQuery, useTheme } from "@mui/material";

function IDE() {
  const [context, setContext] = React.useState();
  const progressElement = document.getElementById("nuc-progress-indicator");
  const navigate = useNavigate();
  const location = useLocation();
  const modeQuery = location.search;

  const [event] = useEvent("PAGE_LOADED", {
    name: null,
  });

  const theme = useTheme();
  const mobileSize = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (mobileSize) {
      navigate("/mobile");
      Settings.landing({ level: Number.MAX_SAFE_INTEGER });
    }
    // eslint-disable-next-line
  }, [mobileSize]);

  function getContextFromStorage(projectId) {
    const context = storage.get("ide", "projects", projectId);
    const nucContext = State.withPages({ context });
    nucContext.get = (prop) => State.resolve(nucContext, prop);

    return nucContext;
  }

  async function project(projectId) {
    const [projectResult, serviceResult] = await Promise.all([
      service.getProject(projectId),
      service.getProjectServices(projectId),
    ]);

    const projectService = serviceResult.data;
    const project = projectResult.data;

    if (project.type === "SINGLE") {
      const contextId = projectService[0].id;
      const contextResult = await service.getContext(contextId);

      const context = contextResult.data;

      const nucContext = State.withPages({ context });
      nucContext.get = (prop) => State.resolve(nucContext, prop);
      nucContext.nucleoid.project = {
        type: "CLOUD",
        name: project.name,
        id: contextId,
        description: project.description,
      };

      storage.set("ide", "selected", "project", {
        id: project.id,
        type: "CLOUD",
      });

      return nucContext;
    } else {
      console.log("Multiple projects not supported yet.");
    }
  }

  function sampleProject() {
    const context = State.withSample();
    context.get = (prop) => State.resolve(context, prop);
    storage.set(
      "ide",
      "projects",
      context.nucleoid.project.id,
      context.nucleoid
    );

    navigate(`${context.nucleoid.project.id}/api?mode=local`);
    navigate(0);

    return context;
  }

  function blankProject() {
    const context = State.withBlank();
    context.get = (prop) => State.resolve(context, prop);

    storage.set(
      "ide",
      "projects",
      context.nucleoid.project.id,
      context.nucleoid
    );

    navigate(`${context.nucleoid.project.id}/api?mode=local`);
    navigate(0);

    return context;
  }

  const initContext = (context) => {
    if (
      !Settings.description() ||
      Settings.description() !== context.nucleoid.project.description
    ) {
      Settings.description(context.nucleoid.project.description);
    }

    if (!Settings.name() || Settings.name !== context.nucleoid.project.name) {
      Settings.name(context.nucleoid.project.name);
    }

    if (!Settings.landing()) {
      Settings.landing({ level: 0 });
    }

    if (mobileSize) {
      navigate("/mobile");
      navigate(0);
      Settings.landing({ level: Number.MAX_SAFE_INTEGER });
    }

    if (context.nucleoid.project.type === "LOCAL") {
      storage.set("ide", "selected", "project", {
        id: context.nucleoid.project.id,
        type: "LOCAL",
      });
    }

    return context;
  };

  const initVfs = (context) => {
    const files = contextToMap(context.nucleoid);
    vfs.init(files);
  };

  React.useEffect(() => {
    async function initMode() {
      const mode = Path.getMode();
      const projectId = Path.getProjectId();

      if (mode === "sample") {
        sampleProject();
      } else if (mode === "cloud") {
        project(projectId).then((result) => {
          initVfs(result);
          return setContext(initContext(result));
        });
      } else if (mode === "local") {
        const context = getContextFromStorage(projectId);

        return setContext(initContext(context));
      } else if (mode === "mobile") {
        return setContext("mobile");
      } else if (mode === "recentProject") {
        const recentProject = storage.get("ide", "selected", "project");

        if (storage.get("ide", "selected", "project")) {
          publish("RECENT_PROJECT_FOUND", { found: true });
        }

        if (recentProject.type === "CLOUD") {
          navigate(`${recentProject.id}/api`);
          navigate(0);
        } else if (recentProject.type === "LOCAL") {
          navigate(`${recentProject.id}/api?mode=local`);
          navigate(0);
        }
      } else {
        blankProject();
        publish("RECENT_PROJECT_FOUND", { found: false });
      }
    }

    initMode();
    // eslint-disable-next-line
  }, [progressElement.classList]);

  useEffect(() => {
    if (context && event.name) {
      publish("CONTAINER_LOADED", {
        name: "IDE",
      });
    }
  }, [context, event.name]);

  if (!context) return null;
  if (context === "error") return "forbidden";

  return (
    <ContextProvider state={context} reducer={contextReducer}>
      <Box sx={styles.root}>
        <Menu list={routes} query={modeQuery} title="IDE" />
        <EducationDrawer />
        <Box sx={styles.content}>
          <Outlet />
        </Box>
        {Settings.landing().level < 5 && <Onboard />}
        <ProcessDrawer />
        <SwaggerDialog />

        <PopChat />
        <GraphDialog />
      </Box>
    </ContextProvider>
  );
}

export default IDE;
