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
      getCodeFromGithub((code) => {
        if (code) {
          auth({ code: code })
            .then((res) => {
              localStorage.setItem("accessToken", res.accessToken);
              localStorage.setItem("refreshToken", res.refreshToken);

              return reject(true);
            })
            .catch((err) => {
              return reject(err);
            });
        } else {
          return reject(false);
        }
      });
    } else if (!accessToken) {
      auth({ refreshToken: refreshToken })
        .then((res) => {
          localStorage.setItem("accessToken", res.accessToken);
          localStorage.setItem("refreshToken", res.refreshToken);

          return reject(true);
        })
        .catch((err) => {
          return reject(err);
        });
    }
  });
};

const getCodeFromGithub = (callback) => {
  const gitHubWindow = window.open(
    `https://github.com/login/oauth/authorize?scope=user&client_id=${
      Settings.github.client_id
    }&redirect_uri=${"http://" + window.location.hostname + ":4000/login"}`,
    "_blank",
    "toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=50,width=500,height=800"
  );

  const myInterval = setInterval(() => {
    if (gitHubWindow.closed) {
      clearInterval(myInterval);
      const url = gitHubWindow.location.href;

      if (url) {
        const newUrl = url.split("?code=");
        callback(newUrl[1]);
      } else {
        callback(false);
      }
    }
  }, 400);
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

const query = async (body) => {
  return fetch(Settings.url.terminal(), {
    method: "POST",
    body,
  }).then((response) => response.json());
};

const openapi = (action, nuc) => {
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
        nuc,
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
  const token = localStorage.getItem("accessToken");

  return axios(Settings.service.projects, {
    method: "GET",
    params: {
      limit: limit && 1,
    },
    headers: {
      authorization: "Bearer " + token,
    },
  });
};

const getProject = (project) => {
  const token = localStorage.getItem("accessToken");

  return axios(Settings.service.projects + "/" + project, {
    method: "GET",
    headers: {
      authorization: "Bearer " + token,
    },
  });
};

const addProject = (name, context) => {
  const token = localStorage.getItem("accessToken");

  return axios(Settings.service.projects, {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
    },
    data: { name: name, context: context },
  });
};

const updateProject = (project, name, context) => {
  const token = localStorage.getItem("accessToken");

  return axios(Settings.service.projects + "/" + project, {
    method: "POST",
    headers: {
      authorization: "Bearer " + token,
    },
    data: { name: name, context: context },
  });
};

const deleteProject = (project) => {
  const token = localStorage.getItem("accessToken");

  return axios(Settings.service.projects + "/" + project, {
    method: "DELETE",
    headers: {
      authorization: "Bearer " + token,
    },
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
