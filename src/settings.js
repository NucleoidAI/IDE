import { storage } from "@nucleoidjs/webstorage";
const Settings = {
  projects: [],
  dialog: {},
  url: {
    base: "https://nucleoid.com",
    terminal: (url) => {
      if (url) {
        storage.set("ide", "terminal", url);
      } else {
        return storage.get("ide", "terminal");
      }
    },
    app: (url) => {
      if (url) {
        storage.set("ide", "app", url);
      } else {
        return storage.get("ide", "app");
      }
    },
  },
  sandbox: {
    url: "https://nucleoid.com/sandbox/",
    sandboxID: (id) => {
      if (id) {
        storage.set("ide", "sandbox_id", id);
      } else {
        return storage.get("ide", "sandbox_id");
      }
    },
  },
  github: {
    client_id: "6a44f854367bd3fb5f13",
    token_url: "https://github.com/login/oauth/access_token",
    user: "https://api.github.com/user",
  },

  connection: true,
  beta: (status) => {
    if (status !== undefined && status !== null) {
      storage.set("ide", "beta", status);
    } else {
      return storage.get("ide", "beta") === true;
    }
  },
  debug: (status) => {
    if (status !== undefined && status !== null) {
      storage.set("ide", "debug", status);
    } else {
      return storage.get("ide", "debug") === true;
    }
  },
  runtime: (data) => {
    if (data !== undefined && data !== null) {
      storage.set("ide", "runtime", data);
    } else {
      return storage.get("ide", "runtime");
    }
  },
  description: (data) => {
    if (data !== undefined && data !== null) {
      storage.set("ide", "description", data);
    } else {
      return storage.get("ide", "description");
    }
  },
  name: (data) => {
    if (data !== undefined && data !== null) {
      storage.set("ide", "name", data);
    } else {
      return storage.get("ide", "name");
    }
  },
  plugin: (data) => {
    if (data !== undefined && data !== null) {
      storage.set("ide", "plugin", data);
    } else {
      return storage.get("ide", "plugin");
    }
  },
  landing: (data) => {
    if (data !== undefined && data !== null) {
      storage.set("ide", "landing", data);
    } else {
      return storage.get("ide", "landing");
    }
  },
  token: () => {
    if (storage.get("refreshToken") && storage.get("accessToken")) {
      return true;
    } else {
      return false;
    }
  },
};

export default Settings;
