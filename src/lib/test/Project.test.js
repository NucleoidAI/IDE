import {
  createAPI,
  createCodeSnippets,
  createObject,
  extractCodeBlocks,
  typeCheck,
} from "../Project.js";

describe("Project Converter", () => {
  describe("typeCheck", () => {
    test("should identify a function code snippet", () => {
      const functionSnippet = `function greet(name: string) {
        return \`Hello, \${name}!\`;
      }`;
      expect(typeCheck(functionSnippet)).toBe("function");
    });

    test("should identify a declaration code snippet", () => {
      const declarationSnippet = `use declarative;
      $Human.mortal = true;`;
      expect(typeCheck(declarationSnippet)).toBe("declaration");
    });

    test("should identify a class code snippet", () => {
      const classSnippet = `class Human {
        name: string;
        constructor(name: string) {
          this.name = name;
        }
      }`;
      expect(typeCheck(classSnippet)).toBe("class");
    });

    test("should return null for an unknown code snippet type", () => {
      const unknownSnippet = "invalid code snippet";
      expect(typeCheck(unknownSnippet)).toBeNull();
    });
  });

  describe("createObject", () => {
    test("should create a declaration object from a declaration snippet", () => {
      const declarationSnippet = `$Human.mortal = true;`;
      const expectedDeclaration = {
        description: "",
        summary: "",
        definition: declarationSnippet,
      };
      expect(createObject(declarationSnippet)).toEqual(expectedDeclaration);
    });

    test("should create a function object from a function snippet", () => {
      const functionSnippet = `function greet(name: string) {
        return \`Hello, \${name}!\`;
      }`;
      const expectedFunction = {
        path: "",
        params: [],
        type: "FUNCTION",
        definition: functionSnippet,
      };
      expect(createObject(functionSnippet)).toEqual(expectedFunction);
    });

    test("should handle a function snippet with a class definition", () => {
      const functionSnippet = `
        class Human {
          name: string;
          constructor(name: string) {
            this.name = name;
          }
        }
      `;
      const expectedFunction = {
        path: "Human",
        params: ["name: string"],
        type: "CLASS",
        definition: functionSnippet,
      };
      expect(createObject(functionSnippet)).toEqual(expectedFunction);
    });

    test("should handle a function snippet with a regular function definition", () => {
      const functionSnippet = `
        function sayHello(name: string) {
          console.log(\`Hello, \${name}!\`);
        }
      `;
      const expectedFunction = {
        path: "",
        params: [],
        type: "FUNCTION",
        definition: functionSnippet,
      };
      expect(createObject(functionSnippet)).toEqual(expectedFunction);
    });

    test("should handle an invalid code snippet", () => {
      const invalidSnippet = "invalid code";
      expect(createObject(invalidSnippet)).toBeNull();
    });
  });

  describe("createCodeSnippets", () => {
    test("should correctly separate declaration snippets and function snippets from a code block with the 'use declarative' directive", () => {
      const codeBlock = `use declarative;
$Human.mortal = true;
function greet(name: string) {
return \`Hello, \${name}!\`;
}`;
      const expectedResult = {
        declarationSnippets: ["$Human.mortal = true;"],
        functionSnippets: [
          `function greet(name: string) {
return \`Hello, \${name}!\`;
}`,
        ],
      };
      expect(createCodeSnippets(codeBlock)).toEqual(expectedResult);
    });

    test("should correctly separate declaration snippets and function snippets from a code block with the 'use imperative' directive or no directive", () => {
      const codeBlock = `
use imperative;
let x = 10;
function double(num: number) {
return num * 2;
}`;
      const expectedResult = {
        declarationSnippets: [],
        functionSnippets: [
          `function double(num: number) {
return num * 2;
}`,
        ],
      };
      expect(createCodeSnippets(codeBlock)).toEqual(expectedResult);
    });

    test("should handle a code block with only function snippets", () => {
      const codeBlock = `
function greet(name: string) {
return \`Hello, \${name}!\`;
}
function double(num: number) {
return num * 2;
}`;
      const expectedResult = {
        declarationSnippets: [],
        functionSnippets: [
          `function greet(name: string) {
return \`Hello, \${name}!\`;
}`,
          `function double(num: number) {
return num * 2;
}`,
        ],
      };
      expect(createCodeSnippets(codeBlock)).toEqual(expectedResult);
    });

    test("should handle a code block with both declaration snippets and function snippets", () => {
      const codeBlock = `
use declarative;
$Human.mortal = true;
function greet(name: string) {
return \`Hello, \${name}!\`;
}
$Human.age = 0;
function double(num: number) {
return num * 2;
}`;
      const expectedResult = {
        declarationSnippets: ["$Human.mortal = true;", "$Human.age = 0;"],
        functionSnippets: [
          `function greet(name: string) {
return \`Hello, \${name}!\`;
}`,
          `function double(num: number) {
return num * 2;
}`,
        ],
      };
      expect(createCodeSnippets(codeBlock)).toEqual(expectedResult);
    });

    test("should correctly extract code blocks from messages", () => {
      const messages = [
        {
          content: "Here's a code block:",
          code: `
use declarative;
$Human.mortal = true;
function greet(name: string) {
return \`Hello, \${name}!\`;
}`,
        },
        {
          content: "Message block without code",
        },
        {
          content: "Another code block:",
          code: `
use imperative;
let x = 10;
function double(num: number) {
return num * 2;
}`,
        },
      ];
      const expectedCodeBlocks = [
        `use declarative;
$Human.mortal = true;
function greet(name: string) {
return \`Hello, \${name}!\`;
}`,
        `use imperative;
let x = 10;
function double(num: number) {
return num * 2;
}`,
      ];

      const actualCodeBlocks = extractCodeBlocks(messages).map((code) =>
        code.trim()
      );

      expect(actualCodeBlocks).toEqual(expectedCodeBlocks);
    });
  });

  describe("extractCodeBlocks", () => {
    test("should correctly extract code blocks from messages", () => {
      const messages = [
        {
          content: "Here's a code block:",
          code: `
  use declarative;
  $Human.mortal = true;
  function greet(name: string) {
    return \`Hello, \${name}!\`;
  }
          `,
        },
        {
          content: "Message block without code",
        },
        {
          content: "Another code block:",
          code: `
  use imperative;
  let x = 10;
  function double(num: number) {
    return num * 2;
  }
          `,
        },
      ];
      const expectedCodeBlocks = [
        `use declarative;
  $Human.mortal = true;
  function greet(name: string) {
    return \`Hello, \${name}!\`;
  }`,
        `use imperative;
  let x = 10;
  function double(num: number) {
    return num * 2;
  }`,
      ];

      const actualCodeBlocks = extractCodeBlocks(messages).map((code) =>
        code.trim()
      );

      expect(actualCodeBlocks).toEqual(expectedCodeBlocks);
    });

    test("should handle messages with no code blocks", () => {
      const messages = [
        {
          content: "Just a regular message",
        },
      ];
      const expectedResult = [];
      expect(extractCodeBlocks(messages)).toEqual(expectedResult);
    });
  });

  describe("createAPI", () => {
    test("should create an API object with the correct structure and constructor params", () => {
      const classDefinition = `
        class Human {
          name: string;
          constructor(name: string) {
            this.name = name;
          }
        }
      `;

      const functions = [
        {
          path: "",
          params: ["name: string"],
          type: "CLASS",
          definition: classDefinition,
        },
      ];

      const expectedAPI = [
        {
          path: "/humans",
          method: "GET",
          params: [],
          response: {
            type: "OPENAPI",
            schema: {
              name: "Human",
              type: "object",
              properties: [
                {
                  name: "name",
                  type: "string",
                },
              ],
            },
          },
          summary: "List humans",
          description: "List humans",
          "x-nuc-action": expect.any(String),
        },
        {
          path: "/humans",
          method: "POST",
          params: [],
          request: {
            type: "OPENAPI",
            schema: {
              type: "object",
              properties: [
                {
                  name: "name",
                  type: "string",
                },
              ],
            },
          },
          response: {
            type: "OPENAPI",
            schema: {
              name: "Human",
              type: "object",
              properties: [
                {
                  name: "name",
                  type: "string",
                },
              ],
            },
          },
          summary: "Create a Human",
          description: "Create a Human",
          "x-nuc-action": expect.any(String),
        },
        {
          path: "/humans/{HumanId}",
          method: "GET",
          params: [
            {
              name: "humanId",
              in: "path",
              type: "string",
              required: true,
              description: "Human ID",
            },
          ],
          response: {
            type: "OPENAPI",
            schema: {
              name: "Human",
              type: "object",
              properties: [
                {
                  name: "name",
                  type: "string",
                },
              ],
            },
          },
          summary: "Read a Human",
          description: "Read a Human",
          "x-nuc-action": expect.any(String),
        },
      ];

      const api = createAPI(functions);

      expect(api).toEqual(expectedAPI);
    });
  });
});
