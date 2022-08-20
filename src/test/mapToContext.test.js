import State from "state";
import tsCompiler, { mapToContext } from "tsCompiler";

test("should map to context ", async () => {
  const state = State.withSample();
  const nuc = state.get("nucleoid");
  await tsCompiler.init(nuc);
  tsCompiler.compile(nuc);

  const map = mapToContext(tsCompiler.fsMap, nuc);

  //expect(map).toEqual(nuc);
  console.log(map);
});
