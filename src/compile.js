import linter from "linter";
import rules from "widgets/Editor/rules";

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

  Object.keys(nuc.api).forEach((item) => {
    Object.keys(nuc.api[item]).forEach((method) => {
      console.log(nuc.api[item][method]["x-nuc-action"]);
    });
  });

  console.debug(context);
};

export default Compile;
