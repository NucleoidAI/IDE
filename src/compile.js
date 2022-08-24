import tsCompiler from "tsCompiler";

const Compile = (context) => {
  const nuc = context.get("nucleoid");

  if (tsCompiler.isInit()) {
    console.log(tsCompiler.compile(nuc));
  } else {
    tsCompiler.init(nuc).then((item) => {
      console.log("init success");
    });
  }
};

export default Compile;
