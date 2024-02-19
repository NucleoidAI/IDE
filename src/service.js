import Settings from "./settings";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { storage } from "@nucleoidjs/webstorage";

const refreshAuthLogic = async (failedRequest) => {
  const refreshToken = storage.get("refreshToken");
  const accessToken = storage.get("accessToken");

  let tokenRefreshResponse;

  if (!refreshToken && !accessToken) {
    const code = await getCodeFromGithub();

    tokenRefreshResponse = await auth({ code: code });
  } else {
    tokenRefreshResponse = await auth({ refreshToken: refreshToken });
  }
  storage.set("accessToken", tokenRefreshResponse.accessToken);
  storage.set("refreshToken", tokenRefreshResponse.refreshToken);

  failedRequest.response.config.headers["Authorization"] =
    "Bearer " + tokenRefreshResponse.accessToken;
};

createAuthRefreshInterceptor(axios, refreshAuthLogic);

axios.interceptors.request.use((request) => {
  const accessToken = storage.get("accessToken");
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  return request;
});

const getCodeFromGithub = () => {
  const popup = window.open(
    `https://github.com/login/oauth/authorize?scope=user&client_id=${Settings.github.client_id}`,
    "target_blank",
    "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=50,width=650,height=750"
  );

  return new Promise((resolve, reject) => {
    const timer = setInterval(function () {
      if (popup.closed) {
        clearInterval(timer);
        if (popup.location.href) {
          resolve(popup.location.href.split("?code=")[1]);
        } else {
          reject({ error: "POPUP_FORCE_CLOSED" });
        }
      }
    }, 700);
  });
};

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

const completions = async (mode, context, message) => {
  return axios(Settings.service.completions, {
    method: "POST",
    data: { mode, context, message },
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

const auth = (body) =>
  fetch(Settings.service.auth, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((response) => response.json());

const getUserFromGit = (token) =>
  fetch(Settings.github.user, {
    method: "POST",
    headers: {
      authorization: "token " + token,
    },
  }).then((response) => response.json());

const getProjects = () => {
  return axios.get(Settings.service.projects);
};

const getProject = (project) => {
  return axios.get(Settings.service.projects + "/" + project);
};

const addProject = (name, context) => {
  return axios(Settings.service.projects, {
    method: "POST",
    data: { name: name, context: context },
  });
};

const updateProject = (project, name, context) => {
  return axios(Settings.service.projects + "/" + project, {
    method: "POST",
    data: { name: name, context: context },
  });
};

const deleteProject = (project) => {
  return axios(Settings.service.projects + "/" + project, {
    method: "DELETE",
  });
};

const getGraph = () => {
  return axios.get(Settings.url.terminal() + "/graph");
};

const getConfig = () => {
  return axios.get(Settings.url.base + "/config");
};

const createSandbox = (context) => {
  return axios(Settings.sandbox.url, {
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
  auth,
  getUserFromGit,
  getProject,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  createSandbox,
  getCodeFromGithub,
  getGraph,
  getConfig,
};

export default service;
