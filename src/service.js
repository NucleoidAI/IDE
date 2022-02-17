import Settings from "./settings";

const query = async (body) => {
  return fetch(Settings.url.terminal, {
    method: "POST",
    body: body,
  }).then((response) => response.text());
};

const openApiStart = (value) => {
  return fetch(Settings.url.terminal, {
    method: "POST",
    body: `
    let nuc=${JSON.stringify(value)});
    NUC.load(nuc);
    OpenAPI.start(nuc);
    `,
  });
};

const openApiStop = () => {
  return fetch(Settings.url.terminal, {
    method: "POST",
    body: "OpenAPI.stop()",
  });
};

const Service = { query, openApiStart, openApiStop };

export default Service;
