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

const Compile = (context, files) => {
  const nuc = context.get("nucleoid");

  let fs = contextToMap(nuc);

  if (vfs.fsMap().size <= 18) {
    fs.forEach((item) => {
      vfs.add(item.key, item.value);
    });
  } else {
    fs = fs.filter(
      (item) => item.key === files.path + "." + files.method + ".ts"
    );

    vfs.update(...fs);
    //console.log(vfs.fsMap());
  }

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
