import Settings from "./settings";
import http from "./http";

const query = async (body) => {
  return fetch(Settings.url.terminal(), {
    method: "POST",
    body,
  }).then((response) => response.json());
};

const openapi = async (openapi) => {
  if (openapi["x-nuc-action"] === undefined) {
    return fetch(`${Settings.url.terminal()}/openapi`, {
      method: "GET",
    }).then((response) => response.json());
  } else {
    return fetch(`${Settings.url.terminal()}/openapi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(openapi),
    });
  }
};

const metrics = () =>
  fetch(`${Settings.url.terminal()}/metrics`, {
    method: "GET",
  }).then((response) => response.json());

const logs = () =>
  fetch(`${Settings.url.terminal()}/logs`, {
    method: "GET",
  }).then((response) => response.json());

const getUserFromGit = (token) =>
  fetch(Settings.github.user, {
    method: "POST",
    headers: {
      authorization: "token " + token,
    },
  }).then((response) => response.json());

const getProjects = () => {
  return http.get("/projects");
};

const getProject = (projectId) => {
  return http.get(`/projects/${projectId}`);
};

const addProject = (project) => {
  return http("/projects", {
    method: "POST",
    data: project,
  });
};

const updateProject = (projectId, name) => {
  return http(`/projects/${projectId}`, {
    method: "PUT",
    data: { name },
  });
};

const deleteProject = (projectId) => {
  return http(`/projects/${projectId}`, {
    method: "DELETE",
  });
};

const getProjectServices = (projectId) => {
  return http.get(`/projects/${projectId}/services`);
};

const getContext = (contextId) => {
  return http.get(`services/${contextId}/context`);
};

const saveContext = (contextId, context) => {
  return http.put(`services/${contextId}/context`, context);
};

const getGraph = () => {
  return http.get(Settings.url.terminal() + "/graph");
};

const getConfig = () => {
  return http.get(Settings.url.base + "/config");
};

const createSandbox = (context) => {
  return http(Settings.sandbox.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: JSON.stringify(context),
  });
};

const service = {
  query,
  openapi,
  metrics,
  logs,
  getUserFromGit,
  getProject,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  getProjectServices,
  getContext,
  saveContext,
  createSandbox,
  getGraph,
  getConfig,
};

export default service;
