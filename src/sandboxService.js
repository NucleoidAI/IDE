import config from "../config";
import http from "./http";
import scheduler from "./connectionScheduler";

let sandboxId = null;
let appUrl = "";
let terminalUrl = "";

const createSandbox = async (context) => {
  console.log(context.openapi);
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
    return response.data.id;
  } catch (error) {
    console.error("Error creating sandbox:", error);
    throw error;
  }
};

const setAppUrl = () => {
  appUrl = `${config.sandbox}${sandboxId}/api/openapi.json/`;
};

const getAppUrl = () => {
  return appUrl;
};

const setTerminalUrl = () => {
  terminalUrl = `${config.sandbox}terminal/${sandboxId}`;
};

const getTerminalUrl = () => {
  return terminalUrl;
};

const sandboxService = {
  createSandbox,
  getAppUrl,
  getTerminalUrl,
};

export default sandboxService;
