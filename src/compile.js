import typescript from "typescript";
import vfs from "vfs";

import { parser, contextToMap, mapToContext } from "utils/Parser";

const options = {
  incremental: true,
  target: typescript.ScriptTarget.ES2015,
  module: typescript.ModuleKind.ESNext,
  strict: false,
  alwaysStrict: false,
  allowSyntheticDefaultImports: false,
  noImplicitAny: false,
  isBrowserCode: true,
  alwaysAddExport: false,
  preserveValueImports: false,
  removeComments: false,
  allowJs: true,
  outDir: "/build",
  tsBuildInfoFile: "/tsbuildinfo",
};

const Compile = (context) => {
  const nuc = context.get("nucleoid");

  const fs = contextToMap(nuc);

  fs.forEach((item) => {
    vfs.add(item.key, item.value);
  });

  const host = vfs.host();

  const program = typescript.createIncrementalProgram({
    rootNames: fs.map((file) => file.key),
    options,
    host,
  });

  const emitResult = program.emit();

  const errors = typescript
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  console.log(errors);
};

export default Compile;
