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
  const fileNames = [];
  fileNames.push("// @nuc-imports\n");

  Object.keys(files.functions).forEach((item) => {
    const func = files.functions[item];
    const className = func.path.split("/").pop();

    fileNames.push("import " + className + ` from "` + func.path + `"\n`);
    const lastCurlyBracket = func.definition.lastIndexOf("}");
    const newDefinition = `${func.definition.slice(
      0,
      lastCurlyBracket
    )} static filter = (fn) => ([]);\n static find = (fn) =>  ({});\n}`;
    // TODO: add @nuc-definitions and remove static before giving to sandbox
    // TODO : clear this method
    fileContents.push({
      key: func.path + ".ts",
      value: `${
        !func.builtin ? newDefinition : func.definition
      }\n// @nuc-exports\nexport default ${className};`,
    });
  });

  fileNames.push(`import  _ from "lodash/index";\n`);

  const imports = fileNames.join("");

  Object.keys(files.api).forEach((item) => {
    Object.keys(files.api[item]).forEach((method) => {
      fileContents.push({
        key: item + "." + method + ".ts",
        value:
          imports +
          "// @nuc-action\n" +
          files.api[item][method]["x-nuc-action"] +
          "// @nuc-exports\n",
      });
    });
  });

  return fileContents;
};

const mapToContext = (fsMap, context) => {
  const tmpContext = deepCopy(context);

  const map = [...fsMap].filter(
    (item) => item[0].includes(".js") && item[0].includes("/build")
  );

  map.forEach((each) => {
    each[0] = each[0].slice(6);
  });

  map.forEach((item) => {
    const key = item[0].split(".");

    if (key.length < 3) {
      const path = key[0];
      const fnc = tmpContext.functions.find((a) => a.path === path);

      fnc.definition = parser.parse(item[1]).result[0];
    } else {
      const [api, method] = item[0].split(".");

      tmpContext.api[api][method]["x-nuc-action"] = parser
        .parse(item[1])
        .action()
        .replace("export {};\n", "");
    }
  });

  return tmpContext;
};

export { parser, mapToContext, contextToMap };
