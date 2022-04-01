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
  console.log(JSON.stringify(value));
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
  return fetch(Settings.url.terminal, {
    method: "POST",
    body: "OpenAPI.stop()",
  });
};

const service = { query, checkFormat, openApiStart, openApiStop };

export default service;
