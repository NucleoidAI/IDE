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

  fsMap.forEach((item) => {
    const filePath = item[0];
    const fileContent = item[1];
    const [path, method] = filePath.split(".");

    if (!method) {
      const functionToUpdate = tmpContext.functions.find(
        (f) => f.path === path
      );
      if (functionToUpdate) {
        functionToUpdate.definition = parser.parse(fileContent).result[0];
      }
    } else {
      const apiToUpdate = tmpContext.api.find(
        (api) => api.path === path && api.method === method
      );
      if (apiToUpdate) {
        apiToUpdate["x-nuc-action"] = parser
          .parse(fileContent)
          .action()
          .replace("export {};\n", "");
      }
    }
  });

  return tmpContext;
};
export { parser, mapToContext, contextToMap };
