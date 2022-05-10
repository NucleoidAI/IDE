import Settings from "./settings";
import axios from "axios";

const responseHandler = (response) => {
  return response;
};

const invalidTokenCase = () => {
  localStorage.removeItem("accessToken");

  return new Promise((resolve, reject) => {
    const refreshToken = localStorage.getItem("refreshToken");
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken && !refreshToken) {
      return window.open(
        `https://github.com/login/oauth/authorize?scope=user&client_id=${Settings.github.client_id}&redirect_uri=${window.location.href}`,
        "_self"
      );
    }

    if (!accessToken) {
      auth({ refreshToken: refreshToken })
        .then((res) => {
          localStorage.setItem("accessToken", res.accessToken);
          localStorage.setItem("refreshToken", res.refreshToken);

          service.projects().then((projects) => resolve(projects));
        })
        .catch((err) => reject(err));
    }
  });
};

const errorHandler = async ({ response }) => {
  const { error } = response.data;

  switch (error) {
    case "INVALID_TOKEN":
      return await invalidTokenCase();

    default:
      console.log("unhandled error");
      break;
  }

  return Promise.reject(error);
};

axios.interceptors.response.use(
  (response) => responseHandler(response),
  (error) => errorHandler(error)
);

const lint = async (body, signal) => {
  return fetch(Settings.url.editor, {
    signal: signal,
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: body,
  }).then((response) => response.json());
};

const query = async (body) => {
  return fetch(Settings.url.terminal, {
    method: "POST",
    body,
  }).then((response) => response.json());
};

const openapi = (action, nuc) => {
  if (action === undefined) {
    return fetch(Settings.url.terminal + "openapi", {
      method: "GET",
    }).then((response) => response.json());
  } else {
    return fetch(Settings.url.terminal + "openapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nuc,
        action,
      }),
    });
  }
};

const metrics = () =>
  fetch(Settings.url.terminal + "metrics", {
    method: "GET",
  }).then((response) => response.json());

const logs = () =>
  fetch(Settings.url.terminal + "logs", {
    method: "GET",
  }).then((response) => response.json());

const auth = (body) =>
  fetch(Settings.github.auth, {
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
      Authorization: "token " + token,
    },
  }).then((response) => response.json());

const getProject = () => {
  const token = localStorage.getItem("accessToken");

  return axios(Settings.github.projects, {
    method: "GET",
    headers: {
      Authentication: token,
    },
  });
};

const getProjects = (name, project) => {
  const token = localStorage.getItem("accessToken");

  return axios(Settings.github.projects, {
    method: "GET",
    headers: {
      Authentication: token,
    },
  });
};

const setProject = (name, project) => {
  const token = localStorage.getItem("accessToken");

  return axios(Settings.github.projects, {
    method: "POST",
    headers: {
      Authentication: token,
    },
    data: { name: name, project: project },
  });
};

const service = {
  query,
  lint,
  openapi,
  metrics,
  logs,
  auth,
  getUserFromGit,
  getProject,
  getProjects,
  setProject,
};

export default service;
