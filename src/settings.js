const Settings = {
  projects: [],
  dialog: {},
  url: {
    terminal: (url) => {
      if (url) {
        localStorage.setItem("terminal", url);
      } else {
        return localStorage.getItem("terminal");
      }
    },
    app: (url) => {
      if (url) {
        localStorage.setItem("app", url);
      } else {
        return localStorage.getItem("app");
      }
    },
    setEditor: (url) => {
      localStorage.setItem("editor", url);
    },
    getEditor: () => {
      return localStorage.getItem("editor");
    },
  },
  codesandbox: {
    url: "https://codesandbox.io/api/v1/sandboxes/define?json=1",
    sandboxID: (id) => {
      if (id) {
        localStorage.setItem("sandbox_id", id);
      } else {
        return localStorage.getItem("sandbox_id");
      }
    },
  },
  github: {
    client_id: "d96b1adfef0facc5eb94",
    client_secret: "3123c2be7aa1aec88d2c52c9e1a124c33eba0b08",
    token_url: "https://github.com/login/oauth/access_token",
    user: "https://api.github.com/user",
    auth: "http://localhost:4545/auth/tokens",
    projects: "http://localhost:4545/projects",
  },
  beta: (status) => {
    if (status) {
      localStorage.setItem("beta", status);
    } else {
      return localStorage.getItem("beta");
    }
  },
};

export default Settings;
