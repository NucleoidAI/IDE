import Settings from "./settings";

const query = (value) => {
  const urls = Settings.urls;

  return fetch(urls.nucleoid, {
    method: "POST",
    body: value,
  }).then((response) => response.text());
};

const Service = { query };

export default Service;
