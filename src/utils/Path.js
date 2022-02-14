export const checkPathUsed = (paths, prefix, suffix, value) => {
  if (suffix === value) return false;
  if (value === "") return true;
  if (prefix.charAt(prefix.length - 1) !== "/") prefix += "/";
  if (paths.includes(prefix + value)) return true;

  return false;
};

export const splitPathPrefixAndSuffix = (path) => {
  const pathArray = path.split("/");
  const suffix = pathArray.pop();
  const prefix = pathArray.length <= 1 ? "/" : pathArray.join("/");

  return [prefix, suffix];
};

export const checkLastCharSlashMark = (path) => {
  return path.substring(path.length - 1) === "/" ? true : false;
};
