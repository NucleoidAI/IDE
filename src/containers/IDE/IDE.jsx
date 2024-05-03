import { Box } from "@mui/material";
import Context from "../../context";
import ContextProvider from "../../context/context";
import EducationDrawer from "../../components/EducationDrawer/EducationDrawer";
import GraphDialog from "../../components/GraphDialog/GraphDialog";
import Menu from "../../widgets/Menu";
import Onboard from "./Onboarding";
import Path from "../../utils/Path";
import PopChat from "../../widgets/PopChat";
import ProcessDrawer from "../../widgets/ProcessDrawer/ProcessDrawer";
import Settings from "../../settings";
import SwaggerDialog from "../../components/SwaggerDialog";
import { contextReducer } from "../../context/reducer";
import { contextToMap } from "../../utils/Parser";
import routes from "../../routes";
import service from "../../service";
import { storage } from "@nucleoidjs/webstorage";
import styles from "./styles";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import vfs from "../../vfs";

import { Outlet, useParams } from "react-router-dom"; // eslint-disable-line
import React, { useEffect } from "react";
import { publish, useEvent } from "@nucleoidai/react-event";
import { useMediaQuery, useTheme } from "@mui/material";

let loaded = false;

function IDE() {
  const [ReactContext, setReactContext] = React.useState();
  const navigate = useNavigate();
  const location = useLocation();
  const modeQuery = location.search;
  const { id } = useParams();
  const page = location.pathname.split("/")[2];
  const [contextProviderKey, setContextProviderKey] = React.useState(uuid());
  const [projectChange] = useEvent("PROJECT_CHANGED", { id: null });
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
    const localContext = storage.get("ide", "context", projectId);

    if (!localContext) {
      navigate("/error/api");
      return null;
    }

    const { specification, project } = localContext;

    if (!specification && !project) {
      navigate("/error/api");
      return null;
    }
    publish("PROJECT_NOT_FOUND", { status: false });
    publish("RECENT_PROJECT_NOT_FOUND", { status: false });

    const context = Context.withPages({ specification, project });
    context.get = (prop) => Context.resolve(context, prop);

    return context;
  }

  async function project(projectId) {
    const [projectResult, serviceResult] = await Promise.all([
      service.getProject(projectId),
      service.getProjectServices(projectId),
    ]).catch((error) => {
      if (error.response.status === 404) {
        return [undefined, undefined];
      }
    });

    const projectService = serviceResult.data;
    const project = projectResult.data;

    publish("PROJECT_NOT_FOUND", { status: false });
    publish("RECENT_PROJECT_NOT_FOUND", { status: false });

    if (project.type === "SINGLE") {
      const specificationId = projectService[0].id;
      const { data: specification } = await service.getContext(specificationId);

      const context = Context.withPages({ specification });
      context.get = (prop) => Context.resolve(context, prop);
      context.project = {
        type: "CLOUD",
        name: project.name,
        id: specificationId,
        description: project.description,
      };

      storage.set("ide", "selected", "context", {
        id: project.id,
        type: "CLOUD",
      });

      return context;
    } else {
      console.log("Multiple projects not supported yet.");
    }
  }

  function sampleProject() {
    const context = Context.withSample();
    context.get = (prop) => Context.resolve(context, prop);
    const { specification, project } = context;
    storage.set("ide", "context", project.id, {
      specification: specification,
      project: project,
    });

    navigate(`/${project.id}/api?mode=local`);

    return context;
  }

  function blankProject() {
    const context = Context.withBlank();
    context.get = (prop) => Context.resolve(context, prop);

    return context;
  }

  const initContext = (context) => {
    console.log(context.project);
    if (
      !Settings.description() ||
      Settings.description() !== context.project.description
    ) {
      Settings.description(context.project.description);
    }

    if (!Settings.name() || Settings.name !== context.project.name) {
      Settings.name(context.project.name);
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
      context.project.type === "LOCAL" &&
      storage.get("ide", "context", context.project.id)
    ) {
      storage.set("ide", "selected", "context", {
        id: context.project.id,
        type: "LOCAL",
      });
    }

    if (!page) {
      context.project.type === "CLOUD"
        ? navigate("api")
        : navigate("api?mode=local");
    }

    return context;
  };

  const initVfs = (context) => {
    const files = contextToMap(context.specification);
    vfs.init(files);
  };

  const checkRecentProject = (recentProject) => {
    if (recentProject) {
      publish("PROJECT_NOT_FOUND", { status: false });
      publish("RECENT_PROJECT_NOT_FOUND", { status: false });

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
      const recentProject = Path.getRecentProject();
      console.log("mode", mode);
      if (mode === "sample") {
        sampleProject();
      } else if (mode === "cloud") {
        project(id)
          .then((result) => {
            initVfs(result);
            return setReactContext(initContext(result));
          })
          .catch(() => {
            navigate("/error/api");
          });
      } else if (mode === "local") {
        const context = getContextFromStorage(id);
        if (!context) return;
        initVfs(context);
        return setReactContext(initContext(context));
      } else if (mode === "mobile") {
        return setReactContext("mobile");
      } else if (mode === "new") {
        const blankContext = blankProject();
        setReactContext(initContext(blankContext));
      } else if (mode === "error") {
        const blankContext = blankProject();
        setReactContext(initContext(blankContext));
        publish("PROJECT_NOT_FOUND", { status: true });
      } else {
        checkRecentProject(recentProject);
      }
    }

    initMode();
    loaded = false;
    // eslint-disable-next-line
  }, [id]);
  useEffect(() => {
    if (ReactContext && event.name && !loaded) {
      publish("CONTAINER_LOADED", {
        name: "IDE",
      });
      loaded = true;
    }
  }, [event.name, ReactContext]);

  useEffect(() => {
    if (projectChange.id) {
      setContextProviderKey(uuid());
    }
  }, [projectChange, ReactContext]);

  if (!ReactContext) return null;

  if (ReactContext === "error") return <div>forbiden</div>;
  return (
    <ContextProvider
      key={contextProviderKey}
      state={ReactContext}
      reducer={contextReducer}
    >
      <Box sx={styles.root}>
        <Menu list={routes} query={modeQuery} id={id} title="IDE" />
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
