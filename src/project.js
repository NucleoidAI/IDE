import state from "./state";

const project = {
  check: () => {
    //const project = localStorage.getItem("project");
    const name = localStorage.getItem("name");
    const context = localStorage.getItem("context");

    if ((name, context)) {
      return true;
    } else {
      return false;
    }
  },
  setDemo: () => {
    localStorage.setItem("project", "");
    localStorage.setItem("name", "DEMO");
    localStorage.setItem("context", JSON.stringify(state.withSample()));
  },
  set: (project, name, context) => {
    localStorage.setItem("project", project);
    localStorage.setItem("name", name);
    localStorage.setItem("context", JSON.stringify(context));
  },
  setWithoutStringify: (project, name, context) => {
    localStorage.setItem("project", project);
    localStorage.setItem("name", name);
    localStorage.setItem("context", context);
  },
  updateCurrent: (context) => {
    localStorage.setItem("context", JSON.stringify(context));
  },
  get: () => {
    const project = localStorage.getItem("project");
    const name = localStorage.getItem("name");
    const context = JSON.parse(localStorage.getItem("context"));

    return { project, name, context };
  },
  getStringify: () => {
    const project = localStorage.getItem("project");
    const name = localStorage.getItem("name");
    const context = localStorage.getItem("context");

    return { project, name, context };
  },
  isAuth: () => {
    const authToken = localStorage.getItem("accessToken");

    if (authToken) {
      return true;
    } else {
      return false;
    }
  },
};

export default project;
