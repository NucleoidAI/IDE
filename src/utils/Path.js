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
  const id = window.location.pathname.split("/")[2];
  return id;
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
    } else if (id) {
      return "cloud";
    } else {
      return "undefined";
    }
  }
};

const Path = {
  isUsed,
  split,
  addSlashMark,
  getMode,
  getProjectId,
};

export default Path;
