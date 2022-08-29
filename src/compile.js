import tsCompiler, { parser } from "tsCompiler";

/*
import linter from "linter";
import rules from "widgets/Editor/rules";
const lint = (code) => {
  const options = {
    env: {
      es6: true,
      node: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
    },
    rules,
  };

  return linter.verify(code, options);
};
*/

let lastCall;

const Compile = (context) => {
  const nuc = context.get("nucleoid");
  const result = tsCompiler.compile(nuc);
  console.log(result);
};

export default Compile;
