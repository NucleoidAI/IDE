const Settings = {
  projects: [],
  dialog: {},
  url: {
    terminal: "http://localhost:8448/",
    app: "http://localhost:3000/",
    editor: "http://localhost:8448/lint",
  },
  codesandbox: {
    url: "https://codesandbox.io/api/v1/sandboxes/define?json=1",
  },
  github: {
    client_id: "d96b1adfef0facc5eb94",
    client_secret: "3123c2be7aa1aec88d2c52c9e1a124c33eba0b08",
    token_url: "https://github.com/login/oauth/access_token",
    user: "https://api.github.com/user",
    auth: "http://localhost:4545/auth/tokens",
    projects: "http://localhost:4545/projects",
  },
};

export default Settings;
