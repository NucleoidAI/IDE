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

const getProjectId = () => {
  const parts = window.location.pathname.split("/");
  return parts.length >= 3 ? parts[2] : null;
};

const getRecentProject = () => {
  const recentProject = storage.get("ide", "selected", "context");

  if (recentProject) {
    return recentProject;
  }

  return null;
};

const getMode = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");

  const id = getProjectId();

  if (mode) {
    return mode;
  } else {
    if (id === "sample") {
      return "sample";
    } else if (id === "mobile") {
      return "mobile";
    } else if (id === "chat") {
      return "chat";
    } else if (id === "new") {
      return "new";
    } else if (id === "error") {
      return "error";
    } else if (id) {
      return "cloud";
    } else {
      return null;
    }
  }
};

const Path = {
  isUsed,
  split,
  addSlashMark,
  getMode,
  getProjectId,
  getRecentProject,
};

export default Path;
