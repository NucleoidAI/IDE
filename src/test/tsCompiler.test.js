import tsCompiler, { contextToMap } from "tsCompiler";
import State from "state";

test("Should return true if compiler init", async () => {
  const state = State.withSample();
  const nuc = state.get("nucleoid");
  const compile = tsCompiler.compile(nuc);
  console.log(compile);
});
