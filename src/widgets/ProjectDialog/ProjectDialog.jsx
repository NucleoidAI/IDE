import AddNewButton from "./components/AddNewButton";
import Dialog from "@mui/material/Dialog";
import InlineCreationForm from "./components/InlineCreationForm";
import ProjectList from "./components/ProjectList";
import React from "react";
import State from "../../state";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import service from "../../service";
import { storage } from "@nucleoidjs/webstorage";

import { DialogContent, DialogTitle } from "@mui/material";
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
  const login = true;
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

  useEffect(() => {
    if (event.status) {
      setOpen(true);
    }
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
  }, [projectNotFound.status]);

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

  const contextToCloud = (context) => {
    const { project, api, declarations, functions, types } = context;

    const createdProject = {
      name: project.name,
      type: "SINGLE",
      description: project.description,
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
    <Dialog open={open} fullWidth={true} onClose={onDialogClose}>
      <DialogTitle
        m={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <WorkspacesIcon sx={{ mx: 1 }} />
        Projects
      </DialogTitle>
      <DialogContent>
        <ProjectList
          runProject={(project) => runProject(project)}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          dataFiltered={dataFiltered}
          editProject={(editedProjectName, editedProjectId) =>
            editProject(editedProjectName, editedProjectId)
          }
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
