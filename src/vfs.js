import { FileWatcherEventKind } from "typescript/lib/tsserverlibrary";
import { createDefaultMap } from "./dist/typescript/defaultMap";
import typescript from "typescript";

let host, program;

const watchMap = new Map();
const fsMap = createDefaultMap();

const vfs = {
  newLine: " ",
  useCaseSensitiveFileNames: true,
  getCurrentDirectory: () => "/",
  readFile: (path) => fsMap.get(path),
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
  getExecutingFilePath: () => "/",
  directoryExists: () => true,
  getDirectories: () => [],
  fileExists: (path) => !!fsMap.get(path),
  setTimeout: (callback, ms) => setTimeout(callback, ms),
};

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

const init = () => {
  console.debug("Initializing VFS");
  host = typescript.createWatchCompilerHost(
    [],
    options,
    vfs,
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

export default { init, upsert, remove };
