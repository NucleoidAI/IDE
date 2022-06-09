import Settings from "./settings";
import project from "./project";

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
              nucleoidjs: Settings.beta() ? "0.5.11-0" : "0.5.11",
            },
            scripts: {
              start: "node index.js",
            },
            devDependencies: {
              "@types/node": "^17.0.21",
            },
          },
        },
        "openapi.json": {
          content: JSON.stringify({
            api: context.nucleoid.api,
            types: context.nucleoid.types,
          }),
        },
      },
      template: "node",
      title: "Nucleoid Runtime",
    };
  },
};

export default CodeSandbox;
