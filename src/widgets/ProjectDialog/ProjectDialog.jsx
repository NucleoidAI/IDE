import AddNewButton from "./components/AddNewButton";
import Context from "../../context";
import InlineCreationForm from "./components/InlineCreationForm";
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
  const [login, setLogin] = useState(true);
  const [user, setUser] = useState(null);
  const { id: projectId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [formArea, setFormArea] = useState("button");
  const [localProjects, setLocalProjects] = useState([]);
  const [cloudProjects, setCloudProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [event] = useEvent("RECENT_PROJECT_NOT_FOUND", { status: false });
  const [projectNotFound] = useEvent("PROJECT_NOT_FOUND", { status: false });

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
    const oauthToken = storage.get("oauth.token");
    if (oauthToken) {
      setLogin(true);
      fetchUserDetails();
    }
  }, []);

  useEffect(() => {
    if (event.status) {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.status]);

  useEffect(() => {
    if (projectNotFound.status) {
      setOpen(true);
      publish("GLOBAL_MESSAGE", {
        status: true,
        message: "Project not found",
        severity: "error",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectNotFound.status]);

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
  const contextToCloud = (specifications, project) => {
    const createdProject = {
      name: project.name,
      type: "SINGLE",
      description: project.description,
      service: { specifications },
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
    const { specifications, project } = context;

    setLoading(true);
    context.project.name = name;
    const createdProject = contextToCloud(specifications, project);

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
    const { specifications, project } = context;

    storage.set("ide", "context", context.project.id, {
      specifications: specifications,
      project: project,
    });

    publish("PROJECT_CREATED", {
      id: context.specifications.project.id,
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
    }

    setFormArea("button");
  };

  const uploadToCloud = (projectId) => {
    setLoading(true);
    const project = storage.get("ide", "context", projectId);
    const context = contextToCloud(project);

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
      const { project, specifications } = localContext;
      project.name = name;
      storage.remove("ide", "context", id);
      storage.set("ide", "context", id, {
        specifications: specifications,
        projcet: project,
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

    if (type === "LOCAL") {
      navigate(`/${id}?mode=local`);
    } else if (type === "CLOUD") {
      navigate(`/${id}`);
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
    const projectExist = Boolean(projects.length);
    const message = `To proceed, ${
      projectExist ? "please select a project" : "create a new project"
    }.`;

    if (!event.status && !projectNotFound.status) {
      handleClose();
      setSearchQuery("");
    } else {
      publish("GLOBAL_MESSAGE", {
        status: true,
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
