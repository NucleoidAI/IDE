import config from "../config";
import http from "./http";
import onboardDispatcher from "./components/Onboard/onboardDispatcher";
import scheduler from "./connectionScheduler";

let sandboxId = null;
let appUrl = "";
let terminalUrl = "";
let landingLevel = 0;

const createSandbox = async (context) => {
  try {
    const response = await http(`${config.sandbox}/openapi`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: JSON.stringify(context.openapi),
    });

    sandboxId = response.data.id;
    setAppUrl();
    setTerminalUrl();
    scheduler.start();
    checkLandingLevel();
    return response.data.id;
  } catch (error) {
    console.error("Error creating sandbox:", error);
    throw error;
  }
};

const setAppUrl = () => {
  appUrl = `${config.sandbox}/${sandboxId}/`;
};

const getAppUrl = () => {
  return appUrl;
};

const setTerminalUrl = () => {
  terminalUrl = `${config.sandbox}/terminal/${sandboxId}`;
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
    const response = await http.post(`${terminalUrl}`, body);
    return response.data;
  } catch (error) {
    console.error("Error querying:", error);
    throw error;
  }
};

const checkLandingLevel = () => {
  setTimeout(() => {
    if (landingLevel < 2) {
      onboardDispatcher({ level: 2 });
      setLandingLevel(2);
    }
  }, 0);
};

const setLandingLevel = (level) => {
  landingLevel = level;
};

const sandboxService = {
  createSandbox,
  getAppUrl,
  getTerminalUrl,
  get,
  query,
};

export default sandboxService;
