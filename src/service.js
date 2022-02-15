import { globalState } from "./context";

const query = (value) => {
  const nucleoid = globalState.settings.urls.nucleoid;

  return fetch(nucleoid, {
    method: "POST",
    body: value,
  }).then((response) => response.text());
};

const Service = { query };

export default Service;
