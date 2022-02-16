import Settings from "./settings";

const query = async (body) => {
  const urls = Settings.urls;

  return fetch(urls.nucleoid, {
    method: "POST",
    body: body,
  }).then((response) => response.text());
};

const openApiStart = (value) => {
  const urls = Settings.urls;

  return fetch(urls.nucleoid, {
    method: "POST",
    body: `
    let nuc=${JSON.stringify(value)});
    NUC.load(nuc);
    OpenAPI.start(nuc);
    `,
  });
};

const openApiStop = () => {
  const urls = Settings.urls;

  return fetch(urls.nucleoid, {
    method: "POST",
    body: "OpenAPI.stop()",
  });
};

const Service = { query, openApiStart, openApiStop };

export default Service;
