import Settings from "./settings";
import config from "../config";
import http from "./http";
import onboardDispatcher from "./containers/IDE/Onboarding/onboardDispatcher";
import scheduler from "./connectionScheduler";

let sandboxId = null;
let appUrl = "";
let terminalUrl = "";

const getLandingLevel = () => {
  const { level } = Settings.landing();
  return level;
};

const createSandbox = async (context, runtime) => {
  try {
    let sandboxUrl;
    if (runtime === "custom") {
      const url = new URL(Settings.url.terminal());
      sandboxUrl = url.origin;
    } else {
      sandboxUrl = config.sandbox;
    }

    const response = await http(`${sandboxUrl}/openapi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: JSON.stringify(context.openapi),
    });

    if (runtime === "custom") {
      sandboxId = null;
      setAppUrl(sandboxUrl);
      setTerminalUrl(sandboxUrl);
    } else {
      sandboxId = response.data.id;
      setAppUrl(sandboxUrl);
      setTerminalUrl(sandboxUrl);
    }
    Settings.url.app(appUrl);
    Settings.url.terminal(terminalUrl);
    scheduler.start();
    checkLandingLevel();
    return sandboxId;
  } catch (error) {
    console.error("Error creating sandbox:", error);
    throw error;
  }
};

const setAppUrl = (sandboxUrl) => {
  if (sandboxId) {
    console.log("appUrl", `${sandboxUrl}/${sandboxId}/`);
    appUrl = `${sandboxUrl}/${sandboxId}/`;
  } else {
    appUrl = "http://localhost:3000";
  }
};

const getAppUrl = () => {
  return appUrl;
};

const setTerminalUrl = (sandboxUrl) => {
  if (sandboxId) {
    terminalUrl = `${sandboxUrl}/terminal/${sandboxId}`;
  } else {
    terminalUrl = `${sandboxUrl}`;
  }
};

const getTerminalUrl = () => {
  return terminalUrl;
};

const get = async (endpoint) => {
  try {
    const response = await http.get(`${terminalUrl}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error getting ${endpoint}:`, error);
    throw error;
  }
};
const query = async (body) => {
  try {
    const response = await http.post(`${terminalUrl}`, body, {
      headers: {
        "Content-Type": "application/javascript",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error querying:", error);
    throw error;
  }
};

const checkLandingLevel = () => {
  setTimeout(() => {
    const landingLevel = getLandingLevel();

    if (landingLevel < 2) {
      onboardDispatcher({ level: 2 });
    }
  }, 0);
};

const sandboxService = {
  createSandbox,
  getLandingLevel,
  getAppUrl,
  setTerminalUrl,
  getTerminalUrl,
  get,
  query,
};

export default sandboxService;
