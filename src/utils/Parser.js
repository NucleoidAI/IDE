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
  files.functions.forEach((func) => {
    const className = func.path.split("/").pop();
    fileNames.push(`import ${className} from "${func.path}"\n`);
    const lastCurlyBracket = func.definition.lastIndexOf("}");
    const newDefinition = `${func.definition.slice(
      0,
      lastCurlyBracket
    )} static filter = (fn) => ([]);\n static find = (fn) => ({});\n}`;
    fileContents.push({
      key: func.path + ".ts",
      value: `${
        !func.builtin ? newDefinition : func.definition
      }\n// @nuc-exports\nexport default ${className};`,
    });
  });

  fileNames.push(`import _ from "lodash/index";\n`);
  const imports = fileNames.join("");

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

  return fileContents;
};

const mapToContext = (fsMap, context) => {
  const tmpContext = deepCopy(context);
  tmpContext?.functions?.forEach((func) => {
    func.definition = parser.parse(
      fsMap.get(`/build${func?.path}.js`)
    ).result[0];
  });

  tmpContext?.api?.forEach((api) => {
    console.log(api);
    api["x-nuc-action"] = parser
      .parse(fsMap.get(`/build${api?.path}.${api?.method}.js`))
      .action()
      .replace("export {};\n", "");
  });

  return tmpContext;
};

export { parser, mapToContext, contextToMap };
