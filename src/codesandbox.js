import Settings from "./settings";
import packageLock from "./sandboxPackageLock.json";
import prettier from "./prettier";
import prettierPlugins from "./prettierPlugins";
import project from "./project";
import { v4 as uuid } from "uuid";

const CodeSandbox = {
  generateContent: (context) => {
    return {
      files: {
        "sandbox.config.json": {
          content: `{
              "template": "node",
              "container": {
                "port": 3000,
                "node": "16"
              }
            }`,
        },
        "index.js": {
          content:
            `const nucleoid = require("nucleoidjs");\nconst app = nucleoid();\n\n` +
            context.nucleoid.functions
              .map(
                (item) =>
                  item.definition +
                  "\nnucleoid.register(" +
                  item.path.split("/")[item.path.split("/").length - 1] +
                  ");\n\n"
              )
              .join("") +
            `app.openapi("./openapi.json");\napp.listen(3000);`,
        },
        "package.json": {
          content: {
            name: project.get().name,
            version: "1.0.0",
            main: "index.js",
            license: "MIT",
            dependencies: {
              nucleoidjs: Settings.beta() ? "beta" : "latest",
            },
            scripts: {
              start: "node index.js",
            },
          },
        },
        "openapi.json": {
          content: prettier.format(
            JSON.stringify({
              api: context.nucleoid.api,
              types: context.nucleoid.types,
              id: uuid(),
            }),
            {
              parser: "json",
              plugins: prettierPlugins,
            }
          ),
        },
        "package-lock.json": {
          content: packageLock,
        },
      },
      template: "node",
      title: "Nucleoid Runtime",
    };
  },
};

export default CodeSandbox;
