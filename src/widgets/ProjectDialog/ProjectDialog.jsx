import AddNewButton from "./components/AddNewButton";
import Dialog from "@mui/material/Dialog";
import InlineCreationForm from "./components/InlineCreationForm";
import ProjectList from "./components/ProjectList";
import React from "react";
import State from "../../state";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import config from "../../../config";
import http from "../../http";
import { publish } from "@nucleoidjs/react-event";
import { storage } from "@nucleoidjs/webstorage";
import { useNavigate } from "react-router-dom";

import { DialogContent, DialogTitle } from "@mui/material";
import { useCallback, useEffect, useState } from "react";

function applyFilter({ inputData, query }) {
  if (query) {
    inputData = inputData.filter(
      (item) => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}

function ProjectDialog({ handleClose, open }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [formArea, setFormArea] = useState("button");
  const [localProjects, setLocalProjects] = useState([]);
  const [cloudProjects, setCloudProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

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

  const createProject = (newProject) => {
    const { name, template } = newProject;

    if (template === "sample") {
      createProjectOnCloud(newProject);
    } else if (template === "blank") {
      createBlankTemplate(name);
    }
    setProjects(getProjectsFromLocalStorage());

    setFormArea("button");
  };

  const setContextForCloud = (context) => {
    console.log(context);
  useEffect(() => {
    if (!login) {
      getLocalProjects();
    } else if (login) {
      getLocalProjects();
      getCloudProjects();
    }
  }, [login]);

  useEffect(() => {
    setProjects([...cloudProjects, ...localProjects]);
  }, [cloudProjects, localProjects]);

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

  const createProjectOnCloud = (newProject) => {
    const { name, template } = newProject;
    const context = State.withSample();
    context.get = (prop) => State.resolve(context, prop);
    context.nucleoid.project.name = name;

    const createContext = setContextForCloud(context.nucleoid);

    http.post(`${config.api}/api/projects`, createContext).then((response) => {
      const { data } = response;
  const getCloudProjects = async () => {
    const projects = await cloudToContext();
    setCloudProjects(projects);
  };

      publish("PROJECT_CREATED", {
        id: data.service.contextId,
      });
    });
  const getLocalProjects = () => {
    setLocalProjects(getProjectsFromLocalStorage());
  };

  const uploadToCloud = (projectId) => {
    const project = storage.get("ide", "projects", projectId);
    const context = setContextForCloud(project);

    http.post(`${config.api}/api/projects`, context).then((response) => {
      const { data } = response;

      publish("PROJECT_UPLOADED", {
        id: data.service.contextId,
      });
    });
  };

  useEffect(() => {
    setProjects(getProjectsFromLocalStorage());
  }, []);

  const editProject = (editedProjectName, editedProjectId) => {
    const context = storage.get("ide", "projects", editedProjectId);
    const { project } = context;
    project.name = editedProjectName;
    storage.remove("ide", "projects", editedProjectId);
    storage.set("ide", "projects", editedProjectId, context);

    publish("PROJECT_UPDATED", {
      id: project.id,
    });

    setProjects(getProjectsFromLocalStorage());
  };
  const runProject = (projectId) => {
    //TODO Remove mode
    navigate(`/${projectId}/api?mode=local`);
    navigate(0);

    publish("PROJECT_CHANGED", {
      id: projectId,
    });
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
          justifyContent: "start",
        }}
      >
        <WorkspacesIcon sx={{ mx: 1 }} />
        Projects
      </DialogTitle>
      <DialogContent>
        <ProjectList
          runProject={(projectId) => runProject(projectId)}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          dataFiltered={dataFiltered}
          editProject={(editedProjectName, editedProjectId) =>
            editProject(editedProjectName, editedProjectId)
          }
          deleteProject={(projectId) => deleteProject(projectId)}
          uploadToCloud={(projectId) => uploadToCloud(projectId)}
        />
      </DialogContent>
      <AddNewButton formArea={formArea} setFormArea={setFormArea} />
      <InlineCreationForm
        formArea={formArea}
        setFormArea={setFormArea}
        createProject={(newProject) => createProject(newProject)}
      />
    </Dialog>
  );
}

export default ProjectDialog;
