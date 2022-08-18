import typescript from "typescript";
import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualCompilerHost,
} from "@typescript/vfs";

const config = {
  target: typescript.ScriptTarget.ES2015,
  module: typescript.ModuleKind.ESNext,
  strict: false,
  alwaysStrict: false,
  allowSyntheticDefaultImports: false,
  noImplicitAny: false,
  isBrowserCode: true,
  alwaysAddExport: false,
  allowJs: true,
};

const shouldCache = true;

//let fsMap = null;

const map = (files) => {
  const arr = [];
  const fileNames = [];
  fileNames.push("//@nuc-imports\n");

  Object.keys(files.functions).forEach((item) => {
    const func = files.functions[item];
    fileNames.push(
      "import " +
        func.path.split("/").pop() +
        ` from "nuc-classes/` +
        func.path.split("/").pop() +
        `.js"\n`
    );

    arr.push({
      key: "/nuc-classes/" + func.path.split("/").pop() + ".js",
      value: func.definition + "export default " + func.path.split("/").pop(),
    });
  });

  const imports = fileNames.join("");

  Object.keys(files.api).forEach((item) => {
    Object.keys(files.api[item]).forEach((method) => {
      //console.log(files.api[item][method]["x-nuc-action"]);
      arr.push({
        key: item + "." + method + ".ts",
        value:
          imports + "//@nuc-action\n" + files.api[item][method]["x-nuc-action"],
      });
    });
  });

  return arr;
};

const tsCompiler = {
  compile: async (files) => {
    // if (!fsMap) {
    const fsMap = await createDefaultMapFromCDN(
      config,
      typescript.version,
      shouldCache,
      typescript
    );
    // }

    map(files).forEach((item) => fsMap.set(item.key, item.value));

    const system = createSystem(fsMap);
    const host = createVirtualCompilerHost(system, config, typescript);

    const program = typescript.createProgram({
      rootNames: [...fsMap.keys()].filter((item) => !item.includes("lib")),
      options: config,
      host: host.compilerHost,
    });

    const emitResult = program.emit();

    const allDiagnostics = typescript
      .getPreEmitDiagnostics(program)
      .concat(emitResult.diagnostics);

    return {
      fsMap: fsMap,
      errors: allDiagnostics,
    };
  },
};

export const parser = {
  result: null,
  parse(code) {
    this.result = code.split(/\/\/@nuc-.*/g).filter((item) => item !== "");

    return this;
  },
  action() {
    this.result = this.result.find((item) => item.includes("function action"));

    return this;
  },
};

export default tsCompiler;
