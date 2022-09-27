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
  const arr = [];
  const fileNames = [];
  fileNames.push("// @nuc-imports\n");

  Object.keys(files.functions).forEach((item) => {
    const func = files.functions[item];

    fileNames.push(
      "import " +
        func.path.split("/").pop() +
        ` from "` +
        func.path +
        `.` +
        func.ext +
        `"\n`
    );

    arr.push({
      key: func.path + "." + func.ext,
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
        .action();
    }
  });

  return tmpContext;
};

export { parser, mapToContext, contextToMap };
