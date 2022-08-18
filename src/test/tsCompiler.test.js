import tsCompiler from "tsCompiler";
import State from "state";

test("Should return false if compiler is not init", () => {
  const init = tsCompiler.isInit();

  expect(init).toBe(false);
});

test("Should return true if compiler init", async () => {
  const state = State.withSample();
  const nuc = state.get("nucleoid");

  await tsCompiler.init(nuc);
  const status = tsCompiler.isInit();

  expect(status).toBe(true);
});
