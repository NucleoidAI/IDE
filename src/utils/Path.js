import config from "../config";
import { storage } from "@nucleoidjs/webstorage";

const isUsed = (paths, prefix, suffix, value) => {
  if (value === "" && paths.includes(prefix.charAt(0, prefix.length - 1)))
    return true;
  if (suffix === value) return false;
  if (value === "" || value === null) return true;
  if (prefix.charAt(prefix.length - 1) !== "/") prefix += "/";
  if (paths.includes(prefix + value)) return true;

  return false;
};

const split = (path) => {
  const pathArray = path.split("/");
  const suffix = pathArray.pop();
  const prefix = pathArray.length <= 1 ? "/" : pathArray.join("/");

  return { prefix, suffix };
};

const addSlashMark = (path) => {
  return path?.substring(path.length - 1) !== "/" ? "/" : "";
};

const getRecentProject = () => {
  const recentProject = storage.get("ide", "selected", "context");

  if (recentProject) {
    return recentProject;
  }

  return null;
};

const getMode = () => {
  const { base } = config;
  const modes = ["sample", "mobile", "chat", "new", "error"];

  const urlParts = window.location.pathname.split("/");
  const modeIndex = base ? 3 : 1;
  const mode = urlParts[modeIndex];

  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  const checkId = uuidPattern.test(mode);
  const checkMode = modes.includes(mode);
  const urlParams = new URLSearchParams(window.location.search);
  const queryMode = urlParams.get("mode");

  if (checkId) {
    return queryMode || "cloud";
  } else {
    return checkMode ? mode : "error";
  }
};

const Path = {
  isUsed,
  split,
  addSlashMark,
  getMode,
  getRecentProject,
};

export default Path;
