import { FileWatcherEventKind } from "typescript/lib/tsserverlibrary";
import { createDefaultMap } from "./dist/typescript/defaultMap";
import typescript from "typescript";

let host, program, timeout;

const watchMap = new Map();
const fsMap = createDefaultMap();

const options = {
  target: typescript.ScriptTarget.ES2015,
  module: typescript.ModuleKind.ES2015,
  strict: false,
  alwaysStrict: false,
  allowSyntheticDefaultImports: false,
  noImplicitAny: false,
  isBrowserCode: true,
  alwaysAddExport: false,
  preserveValueImports: false,
  removeComments: false,
  allowJs: true,
  outDir: "/build",
};

const system = {
  args: [],
  newLine: " ",
  useCaseSensitiveFileNames: true,
  write: () => console.error("Unimplemented function"),
  writeOutputIsTTY: () => console.error("Unimplemented function"),
  getWidthOfTerminal: () => console.error("Unimplemented function"),
  readFile: (path) => fsMap.get(path),
  getFileSize: () => console.error("Unimplemented function"),
  writeFile: (path, data) => {
    fsMap.set(path, data);

    if (path.startsWith("/build/")) return;

    const callback = watchMap.get(path);

    if (callback) {
      callback(path, FileWatcherEventKind.Changed);
    } else {
      program.updateRootFileNames([...watchMap.keys(), path]);
    }
  },
  watchFile: (path, callback) => {
    if (path.startsWith("/lib.")) return;
    watchMap.set(path, callback);
  },
  watchDirectory: () => {},
  resolvePath: () => {},
  fileExists: (path) => !!fsMap.get(path),
  directoryExists: () => true, // TODO incomplete implementation
  getExecutingFilePath: () => "/",
  getCurrentDirectory: () => "/",
  createDirectory: () =>
    console.error("Unimplemented function: createDirectory"),
  getDirectories: () => [],
  readDirectory: () => console.error("Unimplemented function: readDirectory"),
  getModifiedTime: () =>
    console.error("Unimplemented function: getModifiedTime"),
  setModifiedTime: () =>
    console.error("Unimplemented function: setModifiedTime"),
  deleteFile: () => console.error("Unimplemented function: deleteFile"),
  // createHash: Using default function in TypeScript
  createSHA256Hash: () =>
    console.error("Unimplemented function: createSHA256Hash"),
  getMemoryUsage: () => console.error("Unimplemented function: getMemoryUsage"),
  exit: () => console.error("Unimplemented function: exit"),
  realpath: () => console.error("Unimplemented function: realpath"),
  setTimeout: (callback, ms) => (timeout = setTimeout(callback, ms)),
  clearTimeout: () => clearTimeout(timeout),
  clearScreen: () => console.error("Unimplemented function: clearScreen"),
  base64decode: () => console.error("Unimplemented function: base64decode"),
  base64encode: () => console.error("Unimplemented function: base64encode"),
};

const init = () => {
  console.debug("Initializing VFS");
  host = typescript.createWatchCompilerHost(
    [],
    options,
    system,
    // TODO Test createSemanticDiagnosticsBuilderProgram,
    typescript.createEmitAndSemanticDiagnosticsBuilderProgram,
    (diagnostic) => {
      console.debug("Diagnostic", diagnostic);
    },
    (report) => {
      console.debug("Report", report);
    }
  );

  program = typescript.createWatchProgram(host);
};

const upsert = (path, data) => {
  host.writeFile(path, data);
};

const remove = () => {};

const vfs = { init, upsert, remove };
export default vfs;
