import AddNewButton from "./components/AddNewButton";
import Dialog from "@mui/material/Dialog";
import InlineCreationForm from "./components/InlineCreationForm";
import ProjectList from "./components/ProjectList";
import React from "react";
import State from "../../state";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import { publish } from "@nucleoidjs/react-event";
import { storage } from "@nucleoidjs/webstorage";
import { useNavigate } from "react-router-dom";

import { DialogContent, DialogTitle, Typography } from "@mui/material";
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
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const getProjectsFromLocalStorage = () => {
    const projects = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("ide.projects.")) {
        const context = JSON.parse(localStorage.getItem(key));
        if (context.nucleoid && context.nucleoid.project) {
          projects.push(context.nucleoid.project);
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

  const deleteProject = (projectId) => {
    localStorage.removeItem(`ide.projects.${projectId}`);
    setProjects(getProjectsFromLocalStorage());

    publish("PROJECT_DELETED", { id: projectId });
  };

  function createWithSampleTemplate(name) {
    const context = State.withSample();
    context.get = (prop) => State.resolve(context, prop);
    context.nucleoid.project.name = name;
    storage.set("ide", "projects", context.nucleoid.project.id, context);
    publish("PROJECT_CREATED", {
      id: context.nucleoid.project.id,
      template: "SAMPLE",
    });

    return context;
  }

  function createBlankTemplate(name) {
    const context = State.withBlank();
    context.get = (prop) => State.resolve(context, prop);
    context.nucleoid.project.name = name;
    storage.set("ide", "projects", context.nucleoid.project.id, context);
    publish("PROJECT_CREATED", {
      id: context.nucleoid.project.id,
      template: "BLANK",
    });

    return context;
  }

  const createProject = (newProject) => {
    const { name, template } = newProject;

    if (template === "sample") {
      createWithSampleTemplate(name);
    } else if (template === "blank") {
      createBlankTemplate(name);
    }
    setProjects(getProjectsFromLocalStorage());

    setFormArea("button");
  };

  useEffect(() => {
    setProjects(getProjectsFromLocalStorage());
  }, []);

  const editProject = (editedProjectName, editedProjectId) => {
    const context = storage.get("ide", "projects", editedProjectId);
    context.nucleoid.project.name = editedProjectName;
    storage.remove("ide", "projects", editedProjectId);
    storage.set("ide", "projects", editedProjectId, context);

    publish("PROJECT_UPDATED", {
      id: context.nucleoid.project.id,
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
