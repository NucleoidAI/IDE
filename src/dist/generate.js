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
    .substring(1)} from "${value}?raw";\n`;
});

output += "\nconst fsMap = new Map();\n";

fsMap.forEach((key, value) => {
  output += `fsMap.set("${value}",${value
    .replace(/\./g, "_")
    .substring(1)});\n`;
});

output += "\nconst createDefaultMap = () => new Map(fsMap);";
output += "\nexport { createDefaultMap };\n";
fs.writeFileSync("./defaultMap.js", output);
