import { deepCopy } from "./DeepCopy";

const parser = {
  result: null,
  parse(code) {
    this.result = code.split(/\/\/ @nuc-....../g).filter((item) => item !== "");

    return this;
  },
  action() {
    this.result = this.result.find((item) => item.includes("function action"));

    return this.result;
  },
};

const contextToMap = (files) => {
  const fileContents = [];
  const fileNames = ["// @nuc-imports\n"];
  // TODO: add @nuc-definitions and remove static before giving to sandbox
  // TODO : clear this method
  files.functions.map((func) => {
    const className = func.path.split("/").pop();
    const importStatement = `import ${className} from "${func.path}"\n`;
    fileNames.push(importStatement);
  });

  files.functions.forEach((func) => {
    const className = func.path.split("/").pop();
    const lastCurlyBracket = func.definition.lastIndexOf("}");
    const newDefinition = `${func.definition.slice(
      0,
      lastCurlyBracket
    )}// @nuc-exports\nstatic items: ${className}[] = [];\n static filter(fn: (item: ${className}) => boolean): ${className}[] { return this.items.filter(fn); }\n static find(fn: (item: ${className}) => boolean): ${className} | undefined { return this.items.find(fn); }\n}`;

    const functionImports = fileNames
      .filter((name) => !name.includes(func.path))
      .join("");

    fileContents.push({
      key: func.path + ".ts",
      value: `${functionImports}${
        !func.builtin ? newDefinition : func.definition
      }\nexport default ${className};`,
    });
  });

  fileNames.push(`import _ from "lodash/index";\n`);
  const imports = fileNames.join("");
  if (files?.api.length > 0) {
    files.api.forEach((apiItem) => {
      fileContents.push({
        key: apiItem.path + "." + apiItem.method + ".ts",
        value:
          imports +
          "// @nuc-action\n" +
          apiItem["x-nuc-action"] +
          "// @nuc-exports\n",
      });
    });
  }

  return fileContents;
};

const mapToContext = (fsMap, context) => {
  const tmpContext = deepCopy(context);
  tmpContext?.functions?.forEach((func) => {
    func.definition = parser.parse(
      fsMap.get(`/build${func?.path}.ts`)
    ).result[0];
  });

  tmpContext?.api?.forEach((api) => {
    api["x-nuc-action"] = parser
      .parse(fsMap.get(`/build${api?.path}.${api?.method}.ts`))
      .action()
      .replace("export {};\n", "");
  });

  return tmpContext;
};

export { parser, mapToContext, contextToMap };
