import Settings from "./settings";

const format = async (body) => {
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
    body,
  }).then((response) => response.text());
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

const service = {
  query,
  format,
  openapi,
  metrics,
  logs,
};

export default service;
