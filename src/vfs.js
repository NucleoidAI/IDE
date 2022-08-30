import defaultMap from "./defaultMap";
import typescript from "typescript";
import { createSystem, createVirtualCompilerHost } from "@typescript/vfs";

let _system, _host, _fsMap;
const _versionMap = new Map();

const options = {
  target: typescript.ScriptTarget.ES2015,
  module: typescript.ModuleKind.ES2015,
};

const init = () => {
  console.debug("Initializing VFS");
  _fsMap = defaultMap;
  _system = createSystem(_fsMap);
  _host = createVirtualCompilerHost(_system, options, typescript).compilerHost;
  [..._fsMap.keys()].forEach((key) => {
    _host.getSourceFile(key).version = 0;
  });
};

const add = (path, data) => {
  if (_versionMap.get(path)) {
    throw `"${path}" already exists`;
  }

  _system.writeFile(path, data);
  _host.getSourceFile(path).version = version(path);
};

const update = ({ key, value }) => {
  _system.writeFile(key, value);
  _host.getSourceFile(key).version = version(key);
};

const remove = () => {};

const version = (path) => {
  const version = _versionMap.get(path);
  if (!version) {
    _versionMap.set(path, 1);
    return 1;
  } else {
    _versionMap.set(path, version + 1);
    return version + 1;
  }
};

const host = () => _host;
const fsMap = () => _fsMap;

export default { init, add, update, remove, host, fsMap };
