import linter from "linter";
import rules from "widgets/Editor/rules";
import * as ts from "typescript";

const lint = (code) => {
  const options = {
    env: {
      es6: true,
      node: true,
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
    },
    rules,
  };

  return linter.verify(code, options);
};

const Compile = (context) => {
  //let file = "";
  const nuc = context.get("nucleoid");

  const option = {
    compilerOptions: {
      strict: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      strictPropertyInitialization: true,
      strictBindCallApply: true,
      noImplicitThis: true,
      noImplicitReturns: true,
      alwaysStrict: true,
      esModuleInterop: true,
      declaration: true,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      target: "ES2017",
      jsx: "react",
      module: "ESNext",
      moduleResolution: "node",
    },
  };

  Object.keys(nuc.api).forEach((item) => {
    Object.keys(nuc.api[item]).forEach((method) => {
      console.log(
        ts.transpileModule(nuc.api[item][method]["x-nuc-action"], option)
      );
    });
  });
};

export default Compile;
