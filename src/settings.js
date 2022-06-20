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
  },
  service: {
    auth: "http://localhost:5000/oauth",
    projects: "http://localhost:5000/projects",
  },
  connection: true,
  beta: (status) => {
    if (status !== undefined && status !== null) {
      localStorage.setItem("beta", status);
    } else {
      return localStorage.getItem("beta");
    }
  },
  runtime: (data) => {
    if (data) {
      localStorage.setItem("runtime", data);
    } else {
      return localStorage.getItem("runtime");
    }
  },
  /*
  token:{
    refreshToken:(data)=>{

    },
    accessToken:(data)=>{

    }
  }*/
};

export default Settings;
