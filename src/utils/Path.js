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

const Path = {
  isUsed,
  split,
  addSlashMark,
};

export default Path;
