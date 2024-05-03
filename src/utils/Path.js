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
  const urlParts = window.location.pathname.split("/");

  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  const validUuid = urlParts.some((part) => uuidPattern.test(part));

  const urlParams = new URLSearchParams(window.location.search);
  const queryMode = urlParams.get("mode");

  if (validUuid) {
    return queryMode ? queryMode : "cloud";
  } else {
    return null;
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
