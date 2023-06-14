const fs = require("fs");

function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + "/" + files[i];
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

const files = getFiles("./lodash");
let output = "";
// console.log(getFiles("."));

files.forEach((key, value) => {
  output += `import ${key
    .replace(/\.|\/|\-/g, "_")
    .substring(1)} from "${key}?raw";\n`;
});

output += "\nconst fsMap = new Map();\n";

files.forEach((key, value) => {
  output += `fsMap.set("${key.split(".")[1]}.d.ts",${key
    .replace(/\.|\/|\-/g, "_")
    .substring(1)});\n`;
});

output += "\nconst createDefaultMap = () => new Map(fsMap);";
output += "\nexport { createDefaultMap };\n";
fs.writeFileSync("./defaultMap2.js", output);
