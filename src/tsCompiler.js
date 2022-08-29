import typescript from "typescript";
import vfs from "./vfs";

const options = {
  incremental: true,
  target: typescript.ScriptTarget.ES2015,
  module: typescript.ModuleKind.ESNext,
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
  tsBuildInfoFile: "/tsbuildinfo",
};

const tsCompiler = {
  compile(files) {
    const fs = contextToMap(files);

    fs.forEach((item) => {
      vfs.add(item.key, item.value);
    });

    const host = vfs.host();

    const program = typescript.createIncrementalProgram({
      rootNames: fs.map((file) => file.key),
      options,
      host,
    });

    const emitResult = program.emit();
    return typescript
      .getPreEmitDiagnostics(program)
      .concat(emitResult.diagnostics);
  },
};

export const contextToMap = (files) => {
  const arr = [];
  const fileNames = [];
  fileNames.push("// @nuc-imports\n");

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
      value:
        func.definition +
        "// @nuc-exports\n" +
        "export default " +
        func.path.split("/").pop(),
    });
  });

  const imports = fileNames.join("");

  Object.keys(files.api).forEach((item) => {
    Object.keys(files.api[item]).forEach((method) => {
      arr.push({
        key: item + "." + method + ".ts",
        value:
          imports +
          "// @nuc-action\n" +
          files.api[item][method]["x-nuc-action"] +
          "// @nuc-exports\n",
      });
    });
  });

  return arr;
};

export const parser = {
  result: null,
  parse(code) {
    this.result = code.split(/\/\/ @nuc-.*/g).filter((item) => item !== "");

    return this;
  },
  action() {
    this.result = this.result.find((item) => item.includes("function action"));

    return this.result;
  },
};

export const mapToContext = (fsMap, context) => {
  const stringifyContext = JSON.stringify(context);
  const tmpContext = JSON.parse(stringifyContext);
  const map = [...tsCompiler.fsMap].filter((item) => item[0].includes(".js"));

  map.forEach((item) => {
    if (item[0].includes("nuc-classes")) {
      const nucClassName = item[0].split("/").pop().split(".")[0];
      tmpContext.functions.forEach((funct) => {
        if (funct.path.includes(nucClassName)) {
          funct.definition = item[1];
        }
      });
    } else {
      const [api, method] = item[0].split(".");

      tmpContext.api[api][method]["x-nuc-action"] = parser
        .parse(item[1])
        .action()
        .trim();
    }
  });

  return tmpContext;
};

export default tsCompiler;
