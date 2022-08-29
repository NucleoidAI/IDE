const vfs = require("@typescript/vfs");
const typescript = require("typescript");
const fs = require("fs");

const fsMap = vfs.createDefaultMapFromNodeModules({
  target: typescript.ScriptTarget.ES2015,
  module: typescript.ModuleKind.ES2015,
});

fsMap.forEach((key, value) => {
  fs.writeFileSync(`./${value}`, key);
});

let output = "";

fsMap.forEach((key, value) => {
  output += `import ${value
    .replace(/\./g, "_")
    .substring(
      1
    )} from "!!raw-loader!./dist/typescript/lib.d.ts"; // eslint-disable-line import/no-webpack-loader-syntax\n`;
});

output += "\nconst fsMap = new Map();\n";

fsMap.forEach((key, value) => {
  output += `fsMap.set("${value}",${value
    .replace(/\./g, "_")
    .substring(1)});\n`;
});

output += "\nexport default fsMap";
console.log(output);
