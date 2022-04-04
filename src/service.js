import Settings from "./settings";

const checkFormat = async (body) => {
  return fetch(Settings.url.editor, {
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
    body: body,
  }).then((response) => response.text());
};

const openApiStart = (value) => {
  return fetch(Settings.url.terminal + "openapi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{
      "nuc": ${JSON.stringify(value)},
      "action": "start"
    }`,
  });
};

const openApiStop = () => {
  return fetch(Settings.url.terminal + "openapi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: `{
      "nuc": {},
      "action": "stop"
    }`,
  });
};

const getMetrics = () => {
  return fetch(Settings.url.terminal + "metrics", {
    method: "GET",
  }).then((response) => response.json());
};

const getOpenApiStatus = () => {
  return fetch(Settings.url.terminal + "openapi", {
    method: "GET",
  }).then((response) => response.json());
};

const logs = () =>
  fetch(Settings.url.terminal + "logs", {
    method: "GET",
  }).then((response) => response.json());

const service = {
  query,
  checkFormat,
  openApiStart,
  openApiStop,
  getMetrics,
  getOpenApiStatus,
  logs,
};

export default service;
