import { Box } from "@mui/material";
import ContextProvider from "../../context/context";
import EducationDrawer from "../../components/EducationDrawer/EducationDrawer";
import GraphDialog from "../../components/GraphDialog/GraphDialog";
import Menu from "../../widgets/Menu";
import Onboard from "./Onboarding";
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
import { v4 as uuid } from "uuid";

import { Outlet, useParams } from "react-router-dom"; // eslint-disable-line
import React, { useEffect } from "react";
import { publish, useEvent } from "@nucleoidai/react-event";
import { useMediaQuery, useTheme } from "@mui/material";

function IDE() {
  const [context, setContext] = React.useState();
  const progressElement = document.getElementById("nuc-progress-indicator");
  const navigate = useNavigate();
  const location = useLocation();
  const modeQuery = location.search;
  const { id } = useParams();
  const page = location.pathname.split("/")[2];
  const [contextProviderKey, setContextProviderKey] = React.useState(uuid());

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

    if (!context) {
      return setContext("error");
    }

    const nucContext = State.withPages({ context });
    nucContext.get = (prop) => State.resolve(nucContext, prop);

    return nucContext;
  }

  async function project(projectId) {
    const [projectResult, serviceResult] = await Promise.all([
      service.getProject(projectId),
      service.getProjectServices(projectId),
    ]).catch((error) => {
      if (error.response.status === 404) {
        setContext("error");
      }
    });

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

    navigate(`/${context.nucleoid.project.id}/api?mode=local`);

    return context;
  }

  function blankProject() {
    const context = State.withBlank();
    context.get = (prop) => State.resolve(context, prop);

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

    if (
      context.nucleoid.project.type === "LOCAL" &&
      storage.get("ide", "projects", context.nucleoid.project.id)
    ) {
      storage.set("ide", "selected", "project", {
        id: context.nucleoid.project.id,
        type: "LOCAL",
      });
    }

    if (!page) {
      context.nucleoid.project.type === "CLOUD"
        ? navigate("api")
        : navigate("api?mode=local");
    }

    return context;
  };

  const initVfs = (context) => {
    const files = contextToMap(context.nucleoid);
    vfs.init(files);
  };

  const checkRecentProject = (recentProject) => {
    if (recentProject) {
      if (recentProject.type === "CLOUD") {
        navigate(`/${recentProject.id}`);
      } else if (recentProject.type === "LOCAL") {
        navigate(`/${recentProject.id}?mode=local`);
      }
    } else {
      publish("RECENT_PROJECT_NOT_FOUND", { status: true });
      navigate("/new");
    }
  };

  React.useEffect(() => {
    async function initMode() {
      const mode = Path.getMode();
      const projectId = Path.getProjectId();
      const recentProject = Path.getRecentProject();

      if (mode === "sample") {
        sampleProject();
      } else if (mode === "cloud") {
        project(projectId).then((result) => {
          initVfs(result);
          return setContext(initContext(result));
        });
      } else if (mode === "local") {
        const context = getContextFromStorage(projectId);
        initVfs(context);
        return setContext(initContext(context));
      } else if (mode === "mobile") {
        return setContext("mobile");
      } else if (mode === "new") {
        const blankContext = blankProject();
        setContext(initContext(blankContext));
      } else {
        checkRecentProject(recentProject);
      }

      setContextProviderKey(uuid());
    }

    initMode();

    // eslint-disable-next-line
  }, [progressElement.classList, id]);
  useEffect(() => {
    if (context && event.name) {
      publish("CONTAINER_LOADED", {
        name: "IDE",
      });
    }

    setContextProviderKey(uuid());
  }, [context, event.name]);

  if (!context) return null;

  if (context === "error") {
    const blankContext = blankProject();
    setContext(initContext(blankContext));
    publish("PROJECT_NOT_FOUND", { status: true });
    navigate("/error/api");
  }

  return (
    <ContextProvider
      key={contextProviderKey}
      state={context}
      reducer={contextReducer}
    >
      <Box sx={styles.root}>
        <Menu list={routes} query={modeQuery} title="IDE" />
        <EducationDrawer />
        <Box sx={styles.content}>
          <Outlet />
        </Box>
        <Onboard />
        <ProcessDrawer />
        <SwaggerDialog />

        <PopChat />
        <GraphDialog />
      </Box>
    </ContextProvider>
  );
}

export default IDE;
