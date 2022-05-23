const CodeSandbox = {
  generateContent: (context) => {
    return {
      files: {
        "sandbox.config.json": {
          content: `{
              "template": "node"
            }`,
        },
        "index.js": {
          content:
            `const nucleoid = require("nucleoidjs");\nconst app = nucleoid();\n\n` +
            context.nucleoid.functions
              .map(
                (item) =>
                  item.code +
                  "\n\nnucleoid.register(" +
                  item.path.split("/")[item.path.split("/").length - 1] +
                  ");\n\n"
              )
              .join("") +
            `\n\napp.openapi("./openapi.json");\napp.listen(3000);`,
        },
        "package.json": {
          content: {
            name: "nuc-example",
            version: "1.0.0",
            main: "index.js",
            license: "MIT",
            dependencies: {
              nucleoidjs: "0.5.11-0",
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
          content: {
            api: context.nucleoid.api,
            types: context.nucleoid.types,
          },
        },
      },
      template: "node",
      title: "Nucleoid Runtime",
    };
  },
};

export default CodeSandbox;
