import Settings from "./settings";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const refreshAuthLogic = async (failedRequest) => {
  const refreshToken = localStorage.getItem("refreshToken");
  const accessToken = localStorage.getItem("accessToken");

  let tokenRefreshResponse;

  if (!refreshToken && !accessToken) {
    const code = await getCodeFromGithub();
    console.log(code);
    tokenRefreshResponse = await auth({ code: code });
  } else {
    tokenRefreshResponse = await auth({ refreshToken: refreshToken });
  }
  localStorage.setItem("accessToken", tokenRefreshResponse.accessToken);
  localStorage.setItem("refreshToken", tokenRefreshResponse.refreshToken);

  failedRequest.response.config.headers["Authorization"] =
    "Bearer " + tokenRefreshResponse.accessToken;
};

createAuthRefreshInterceptor(axios, refreshAuthLogic);

axios.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem("accessToken");
  request.headers["Authorization"] = `Bearer ${accessToken}`;
  return request;
});

const getCodeFromGithub = () => {
  const gitHubWindow = window.open(
    `https://github.com/login/oauth/authorize?scope=user&client_id=${Settings.github.client_id}&redirect_uri=${Settings.github.redirect_uri}`,
    "_blank",
    "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=50,width=500,height=800"
  );
  return new Promise((resolve, reject) => {
    const myInterval = setInterval(() => {
      let url;
      gitHubWindow.onbeforeunload = () => {
        url = gitHubWindow.location.href;
      };

      if (gitHubWindow.closed) {
        clearInterval(myInterval);

        if (url) {
          const newUrl = url.split("?code=");
          resolve(newUrl[1]);
        } else {
          reject({ error: "ERROR_GIT_CODE" });
        }
      }
    }, 400);
  });
};

const query = async (body) => {
  return fetch(Settings.url.terminal(), {
    method: "POST",
    body,
  }).then((response) => response.json());
};

const openapi = async (action, nuc) => {
  if (action === undefined) {
    return fetch(Settings.url.terminal() + "openapi", {
      method: "GET",
    }).then((response) => response.json());
  } else {
    return fetch(Settings.url.terminal() + "openapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...nuc,
        action,
      }),
    });
  }
};

const metrics = () =>
  fetch(Settings.url.terminal() + "metrics", {
    method: "GET",
  }).then((response) => response.json());

const logs = () =>
  fetch(Settings.url.terminal() + "logs", {
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

const getProjects = (limit) => {
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

const openCodeSandBox = (data) => {
  return axios(Settings.codesandbox.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: JSON.stringify(data),
  });
};

const service = {
  query,
  openapi,
  metrics,
  logs,
  auth,
  getUserFromGit,
  getProject,
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  openCodeSandBox,
  getCodeFromGithub,
};

export default service;
