import AddNewButton from "./components/AddNewButton";
import Context from "../../context";
import InlineCreationForm from "./components/InlineCreationForm";
import Path from "../../utils/Path";
import ProjectList from "./components/ProjectList";
import React from "react";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import config from "../../../config";
import http from "../../http";
import service from "../../service";
import { storage } from "@nucleoidjs/webstorage";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { publish, useEvent } from "@nucleoidai/react-event";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function applyFilter({ inputData, query }) {
  if (query) {
    inputData = inputData.filter(
      (item) => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}

function ProjectDialog({ handleClose, open, setOpen }) {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const { id: projectId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [formArea, setFormArea] = useState("button");
  const [localProjects, setLocalProjects] = useState([]);
  const [cloudProjects, setCloudProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const mode = Path.getMode();
  const [projectFounded] = useEvent("PROJECT_FOUNDED", null);
  const [projectNotFound] = useEvent("PROJECT_NOT_FOUNDED", false);
  const [userEvent] = useEvent("USER", { login: null, id: null });
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const userDetails = await http.getUserDetails();
      setUser(userDetails);
      return userDetails;
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    const oauthToken = storage.get("oauth.token");
    if (oauthToken !== null) {
      setLogin(true);
      fetchUserDetails();
    } else {
      setLogin(false);
      setUser(null);
      setCloudProjects([]);
    }
  }, [userEvent]);

  useEffect(() => {
    if (mode === null) {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (projectNotFound && projectFounded === null) {
      setOpen(true);
      publish("APP_MESSAGE", {
        message: "Project not found",
        severity: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectNotFound]);

  const getProjectsFromLocalStorage = () => {
    const projects = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("ide.context.")) {
        const context = JSON.parse(localStorage.getItem(key));
        if (context.project) {
          projects.push(context.project);
        }
      }
    }
    return projects;
  };

  const handleSearch = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const dataFiltered = applyFilter({
    inputData: projects,
    query: searchQuery,
  });

  const cloudToContext = async () => {
    const response = await service.getProjects();
    const projects = response.data;

    const projectPromises = projects.map(async (project) => {
      if (project.type === "SINGLE") {
        project.type = "CLOUD";
        return project;
      }

      if (project.type === "MULTIPLE") {
        console.log("Multiple services not supported yet");
      }

      return null;
    });

    return await Promise.all(projectPromises);
  };
  const contextToCloud = (specification, project) => {
    const createdProject = {
      name: project.name,
      type: "SINGLE",
      description: project.description,
      service: { specification },
    };

    return createdProject;
  };

  const getCloudProjects = async () => {
    const projects = await cloudToContext();
    setCloudProjects(projects);
  };

  const getLocalProjects = () => {
    setLocalProjects(getProjectsFromLocalStorage());
  };

  useEffect(() => {
    if (!login) {
      getLocalProjects();
    } else if (login) {
      getLocalProjects();
      getCloudProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login]);

  useEffect(() => {
    setProjects([...cloudProjects, ...localProjects]);
  }, [cloudProjects, localProjects]);

  const createProjectOnCloud = (name, context) => {
    const { specification, project } = context;

    setLoading(true);
    context.project.name = name;
    const createdProject = contextToCloud(specification, project);

    service
      .addProject(createdProject)
      .then((response) => {
        getCloudProjects();
        publish("PROJECT_CREATED", {
          id: response.data.id,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function createProjetOnLocal(name, context) {
    context.project.name = name;
    context.project.type = "LOCAL";

    storage.set("ide", "context", context.project.id, {
      specification: context.specification,
      project: context.project,
    });

    publish("PROJECT_CREATED", {
      id: context.project.id,
    });

    return context;
  }

  const createProject = (newProject) => {
    const { name, template } = newProject;
    const context =
      template === "sample" ? Context.withSample() : Context.withBlank();
    context.get = (prop) => Context.resolve(context, prop);

    if (login) {
      createProjectOnCloud(name, context);
    } else {
      createProjetOnLocal(name, context);
      getLocalProjects();
    }

    setFormArea("button");
  };

  const uploadToCloud = (projectId) => {
    setLoading(true);
    const localContext = storage.get("ide", "context", projectId);
    const { project, specification } = localContext;

    const context = contextToCloud(specification, project);

    service
      .addProject(context)
      .then((response) => {
        publish("PROJECT_UPLOADED", {
          id: response.data.id,
        });
        storage.remove("ide", "context", projectId);
        getLocalProjects();
        getCloudProjects();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const editProject = (projectToEdit) => {
    const { name, type, id } = projectToEdit;
    if (type === "LOCAL") {
      const localContext = storage.get("ide", "context", id);
      const { project, specification } = localContext;
      project.name = name;
      storage.remove("ide", "context", id);
      storage.set("ide", "context", id, {
        specification: specification,
        project: project,
      });

      publish("PROJECT_UPDATED", {
        id: project.id,
      });
      getLocalProjects();
    } else if (type === "CLOUD") {
      setLoading(true);

      service
        .updateProject(projectToEdit.id, projectToEdit.name)
        .then(() => {
          publish("PROJECT_UPDATED", {
            id: projectToEdit.id,
          });
          getCloudProjects();
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const deleteProject = (project) => {
    if (project.type === "CLOUD") {
      setLoading(true);
      service
        .deleteProject(project.id)
        .then(() => {
          publish("PROJECT_DELETED", { id: project.id });
        })
        .finally(() => {
          getCloudProjects();
          setLoading(false);
        });
    } else {
      localStorage.removeItem(`ide.context.${project.id}`);
      getLocalProjects();
    }
    publish("PROJECT_DELETED", { id: projectId });
  };

  const runProject = (project) => {
    const { type, id } = project;

    if (type === "LOCAL" || type === "CHAT") {
      navigate(`/${id}?mode=local`);
    } else if (type === "CLOUD") {
      navigate(`/${id}`);
    }
    publish("PROJECT_CHANGED", {
      id,
    });
    publish("RUNTIME_CONNECTION", {
      status: false,
      metrics: { total: 100, free: 50 },
    });
  };

  const handleLogin = async () => {
    const { redirectUri } = config.oauth;
    try {
      const code = await http.getCodeFromGithub();
      const response = await http.oauth({
        code,
        redirectUri,
        grant_type: "authorization_code",
      });
      const accessToken = response.accessToken;
      const refreshToken = response.refreshToken;
      storage.set("oauth.token", {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      setLogin(true);
      fetchUserDetails().then((user) => {
        publish("USER", { login: true, id: user.id });
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const onDialogClose = () => {
    const projectExist = Boolean(projects.length);
    const message = `To proceed, ${
      projectExist ? "please select a project" : "create a new project"
    }.`;

    if (projectFounded !== null && projectId !== "new") {
      handleClose();
      setSearchQuery("");
    } else {
      publish("APP_MESSAGE", {
        message,
        severity: "info",
      });
    }
  };

  return (
    <Dialog
      data-cy={"project-dialog"}
      open={open}
      fullWidth={true}
      onClose={onDialogClose}
    >
      <DialogTitle
        m={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center">
          <WorkspacesIcon sx={{ mx: 1 }} />
          <Typography variant="h6" component="div">
            Projects
          </Typography>
        </Box>
        {login ? (
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1" sx={{ mr: 1 }}>
              {user?.name}
            </Typography>
            {user?.avatarUrl && (
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  marginRight: 8,
                }}
              />
            )}
          </Box>
        ) : (
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        )}
      </DialogTitle>
      <DialogContent data-cy="project-dialog-content">
        <ProjectList
          runProject={(project) => runProject(project)}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          dataFiltered={dataFiltered}
          editProject={(projectToEdit) => editProject(projectToEdit)}
          deleteProject={(project) => deleteProject(project)}
          uploadToCloud={(projectId) => uploadToCloud(projectId)}
          loading={loading}
        />
      </DialogContent>
      <AddNewButton formArea={formArea} setFormArea={setFormArea} />
      <InlineCreationForm
        loading={loading}
        formArea={formArea}
        setFormArea={setFormArea}
        createProject={(newProject) => createProject(newProject)}
      />
    </Dialog>
  );
}

export default ProjectDialog;
