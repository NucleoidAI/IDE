import Project from "../Project.js";

test("compiles class block", () => {
  const blocks = [
    `class Item {
      name: string;
      barcode: string;
      constructor(name: string, barcode: string) {
        this.name = name;
        this.barcode = barcode;
      }
    }`,
  ];

  const result = Project.compile(blocks);
  expect(result.functions[0].path).toBe("/Item");
  expect(result.functions[0].params).toEqual([
    "name: string",
    "barcode: string",
  ]);
  expect(result.functions[0].type).toBe("CLASS");
  expect(result.api[0].path).toBe("/items");
  expect(result.api[0].method).toBe("GET");
  expect(result.api[1].path).toBe("/items");
  expect(result.api[1].method).toBe("POST");
  expect(result.api[2].path).toBe("/items/{ItemId}");
  expect(result.api[2].method).toBe("GET");
});

test("compiles function block", () => {
  const blocks = [
    `function verifyBarcode(item) {
       if (!item.barcode) {
         throw new Error("Barcode is required");
       }
     }`,
  ];

  const result = Project.compile(blocks);
  expect(result.functions[0].path).toBe("/verifyBarcode");
  expect(result.functions[0].type).toBe("FUNCTION");
});

test("compiles declaration block", () => {
  const blocks = [
    `class Item {
      name: string;
      barcode: string;
      constructor(name: string, barcode: string) {
        this.name = name;
        this.barcode = barcode;
      }
    }`,
    `"use declarative"
    if ($Item.name && $Item.barcode) {
       return ($Item.description = $Item.name + $Item.barcode);
     }`,
  ];

  const result = Project.compile(blocks);

  expect(result.declarations[0].definition.replace(/\s/g, "")).toBe(
    "if($Item.name&&$Item.barcode){return($Item.description=$Item.name+$Item.barcode);}"
  );
});

test("compiles empty block", () => {
  const result = Project.compile([]);

  expect(result.api.length).toBe(0);
  expect(result.functions.length).toBe(0);
  expect(result.declarations.length).toBe(0);
});
