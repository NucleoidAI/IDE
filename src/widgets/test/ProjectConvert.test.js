import {
  createAPI,
  extractCodeSnippet,
  extractCodeSnippets,
  typeCheck,
} from "../../utils/ConvertProject";

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

  describe("extractCodeSnippet", () => {
    test("should extract a function code snippet", () => {
      const functionSnippet = `function greet(name: string) {
        return \`Hello, \${name}!\`;
      }`;
      const messageContent = "Here's a function to greet someone:";
      const expectedFunction = {
        path: "",
        params: [],
        type: "FUNCTION",
        definition: functionSnippet,
      };
      expect(extractCodeSnippet(functionSnippet, messageContent)).toEqual(
        expectedFunction
      );
    });

    test("should extract a class code snippet", () => {
      const classSnippet = `class Human {
        name: string;
        constructor(name: string) {
          this.name = name;
        }
      }`;
      const messageContent = "Here's a class definition for Human:";
      const expectedClass = {
        path: "Human",
        params: [],
        type: "CLASS",
        definition: classSnippet,
      };
      expect(extractCodeSnippet(classSnippet, messageContent)).toEqual(
        expectedClass
      );
    });

    test("should extract a declaration code snippet", () => {
      const declarationSnippet = `use declarative;
      $Human.mortal = true;`;
      const messageContent = "And here's a declaration:";
      const expectedDeclaration = {
        description: messageContent,
        summary: messageContent,
        definition: declarationSnippet,
      };
      expect(extractCodeSnippet(declarationSnippet, messageContent)).toEqual(
        expectedDeclaration
      );
    });

    test("should return null for an unknown code snippet type", () => {
      const unknownSnippet = "invalid code snippet";
      const messageContent = "An unknown code snippet:";
      expect(extractCodeSnippet(unknownSnippet, messageContent)).toBeNull();
    });
  });

  describe("extractCodeSnippets", () => {
    test("should extract functions, classes, and declarations from messages", () => {
      const messages = [
        {
          role: "ASSISTANT",
          content: "Here's a function to greet someone:",
          code: `function greet(name: string) {
            return \`Hello, \${name}!\`;
          }`,
        },
        {
          role: "ASSISTANT",
          content: "And here's a declaration:",
          code: `use declarative;
          $Human.mortal = true;`,
        },
        {
          role: "ASSISTANT",
          content: "Finally, here's a class definition:",
          code: `class Human {
            name: string;
            constructor(name: string) {
              this.name = name;
            }
          }`,
        },
      ];
      const expectedFunctions = [
        {
          path: "",
          params: [],
          type: "FUNCTION",
          definition: expect.stringContaining("function greet(name: string)"),
        },
        {
          path: "Human",
          params: [],
          type: "CLASS",
          definition: expect.stringContaining("class Human"),
        },
      ];
      const expectedDeclarations = [
        {
          description: "And here's a declaration:",
          summary: "And here's a declaration:",
          definition: expect.stringContaining("use declarative;"),
        },
      ];
      const result = extractCodeSnippets(messages);
      expect(result.functions).toEqual(
        expect.arrayContaining(expectedFunctions)
      );
      expect(result.declarations).toEqual(
        expect.arrayContaining(expectedDeclarations)
      );
    });

    test("should handle messages with no code snippets", () => {
      const messages = [
        {
          role: "USER",
          content: "Hello!",
        },
        {
          role: "ASSISTANT",
          content: "Hi there!",
        },
      ];
      const expectedResult = {
        functions: [],
        declarations: [],
      };
      expect(extractCodeSnippets(messages)).toEqual(expectedResult);
    });
  });

  describe("createAPI", () => {
    test("should create an API object with the correct structure", () => {
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
          params: [],
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
