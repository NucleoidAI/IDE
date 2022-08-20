import { parser } from "tsCompiler";

test("Returns action function", () => {
  const code = `// @nuc-imports
import Order from "Order.js";
import Item from "Item.js";
// @nuc-action
function action(req) {
    const order = req.params.order;
    const item = new Item();
    delete Order[order];
}
// @nuc-exports
export {};
`;

  const result = parser.parse(code).action();
  expect(result).toEqual(`
function action(req) {
    const order = req.params.order;
    const item = new Item();
    delete Order[order];
}
`);
});
