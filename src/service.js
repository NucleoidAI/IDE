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

const completions = async (mode, context, prompt) => {
  return http(Settings.service.completions, {
    method: "POST",
    data: { mode, context, prompt },
  });
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
  return http.get(Settings.service.projects);
};

const getProject = (project) => {
  return http.get(Settings.service.projects + "/" + project);
};

const addProject = (name, context) => {
  return http(Settings.service.projects, {
    method: "POST",
    data: { name: name, context: context },
  });
};

const updateProject = (project, name, context) => {
  return http(Settings.service.projects + "/" + project, {
    method: "POST",
    data: { name: name, context: context },
  });
};

const deleteProject = (project) => {
  return http(Settings.service.projects + "/" + project, {
    method: "DELETE",
  });
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
  completions,
  metrics,
  logs,
  getUserFromGit,
  getProject,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  createSandbox,
  getGraph,
  getConfig,
};

export default service;
