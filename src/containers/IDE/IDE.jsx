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

function IDE() {
  const [context, setContext] = React.useState();
  const progressElement = document.getElementById("nuc-progress-indicator");
  const navigate = useNavigate();
  const location = useLocation();
  const modeQuery = location.search;

  const [event] = useEvent("PAGE_LOADED", {
    name: "",
  });

  function checkMobileSize() {
    return window.innerWidth < 600;
  }

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

    const contextId = serviceResult.data[0].contextId;
    const contextResult = await service.getContext(contextId);

    const context = contextResult.data;
    const projectService = serviceResult.data;
    const project = projectResult.data;

    const nucContext = State.withPages({ context });

    nucContext.get = (prop) => State.resolve(nucContext, prop);
    nucContext.nucleoid.project = {
      type: "CLOUD",
      name: project.name,
      id: projectService.contextId,
      description: projectService.description,
    };

    return nucContext;
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

  const initContext = (context) => {
    if (!Settings.beta()) {
      Settings.beta(false);
    }

    if (!Settings.debug()) {
      Settings.debug(false);
    }

    if (!Settings.url.app()) {
      Settings.url.app("http://localhost:3000");
    }

    if (!Settings.url.terminal()) {
      Settings.url.terminal("http://localhost:8448");
    }

    if (!Settings.runtime()) {
      Settings.runtime("sandbox");
    }

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
    if (checkMobileSize()) {
      navigate("/mobile");
      navigate(0);
      Settings.plugin(" ");
      Settings.landing({ level: Number.MAX_SAFE_INTEGER });
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

        initVfs(context);

        return setContext(initContext(context));
      } else if (mode === "mobile") {
        return setContext("mobile");
      } else {
        navigate("/sample/api");
        navigate(0);
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
      console.log("PAGE_LOADED", event.name);
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
