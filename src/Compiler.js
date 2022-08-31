import typescript from "typescript";
import vfs from "vfs";

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

const compile = ({ files }) => {
  files.forEach((item) => {
    vfs.upsert(item.key, item.value);
  });

  const host = vfs.host();
  const program = typescript.createIncrementalProgram({
    rootNames: files.map((file) => file.key),
    options,
    host,
  });

  const emitResult = program.emit();
  const errors = typescript
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  console.debug(errors);
};

export { compile };
