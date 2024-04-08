import AddNewButton from "./components/AddNewButton";
import InlineCreationForm from "./components/InlineCreationForm";
import ProjectList from "./components/ProjectList";
import React from "react";
import State from "../../state";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import config from "../../../config";
import http from "../../http";
import { publish } from "@nucleoidai/react-event";
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

function ProjectDialog({ handleClose, open }) {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState(null);
  const { id: projectId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [formArea, setFormArea] = useState("button");
  const [localProjects, setLocalProjects] = useState([]);
  const [cloudProjects, setCloudProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const userDetails = await http.getUserDetails();
      setUser(userDetails);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  useEffect(() => {
    const accessToken = storage.get("accessToken");
    if (accessToken) {
      setLogin(true);
      fetchUserDetails();
    }
  }, []);

  const getProjectsFromLocalStorage = () => {
    const projects = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("ide.projects.")) {
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
      if (project.serviceType === "SINGLE") {
        const servicesResponse = await http.get(
          `/projects/${project.id}/services`
        );

        project.description = servicesResponse.data[0].description;
        project.type = "CLOUD";
        return project;
      }

      if (project.serviceType === "MULTIPLE") {
        console.log("Multiple services not supported yet");
      }

      return null;
    });

    return await Promise.all(projectPromises);
  };

  const contextToCloud = (context) => {
    const { project, api, declarations, functions, types } = context;

    const createdProject = {
      name: project.name,
      serviceType: "SINGLE",
    };

    const service = {
      description: project.description,
      contextId: project.id,
    };
    createdProject.service = service;

    const nucContext = { api, declarations, functions, types };

    createdProject.service.context = nucContext;

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
    setLoading(true);
    context.nucleoid.project.name = name;
    const createdContext = contextToCloud(context.nucleoid);

    service
      .addProject(createdContext)
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
    context.nucleoid.project.name = name;

    storage.set(
      "ide",
      "projects",
      context.nucleoid.project.id,
      context.nucleoid
    );

    publish("PROJECT_CREATED", {
      id: context.nucleoid.project.id,
    });

    return context;
  }

  const createProject = (newProject) => {
    const { name, template } = newProject;
    const context =
      template === "sample" ? State.withSample() : State.withBlank();
    context.get = (prop) => State.resolve(context, prop);

    if (login) {
      createProjectOnCloud(name, context);
    } else {
      createProjetOnLocal(name, context);
    }

    setFormArea("button");
  };

  const uploadToCloud = (projectId) => {
    setLoading(true);
    const project = storage.get("ide", "projects", projectId);
    const context = contextToCloud(project);

    service
      .addProject(context)
      .then((response) => {
        publish("PROJECT_UPLOADED", {
          id: response.data.id,
        });
        storage.remove("ide", "projects", projectId);
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
      const context = storage.get("ide", "projects", id);
      const { project } = context;
      project.name = name;
      storage.remove("ide", "projects", id);
      storage.set("ide", "projects", id, context);

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
      localStorage.removeItem(`ide.projects.${project.id}`);
      getLocalProjects();
    }
    publish("PROJECT_DELETED", { id: projectId });
  };

  const runProject = (project) => {
    const { type, id } = project;

    if (type === "LOCAL") {
      navigate(`/${id}/api?mode=local`);
      navigate(0);
    } else if (type === "CLOUD") {
      navigate(`/${id}/api`);
      navigate(0);
    }

    publish("PROJECT_CHANGED", {
      id: projectId,
    });
  };

  const handleLogin = async () => {
    try {
      const code = await http.getCodeFromGithub();
      const response = await http.oauth({
        code: code,
        grant_type: "authorization_code",
        redirect_uri: config.oauth.redirectUri,
      });
      const accessToken = response.accessToken;
      const refreshToken = response.refreshToken;
      storage.set("oauth.token", {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      setLogin(true);
      fetchUserDetails();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const onDialogClose = () => {
    handleClose();
    setSearchQuery("");
  };

  return (
    <Dialog open={open} fullWidth={true} onClose={onDialogClose}>
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
      <DialogContent>
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
