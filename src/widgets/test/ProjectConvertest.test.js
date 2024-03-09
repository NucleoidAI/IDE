import {
  codeAdapter,
  createAPI,
  createProject,
  typeCheck,
} from "./projectConverter";

describe("Project Converter", () => {
  describe("codeAdapter", () => {
    test("should return an object with functions and declarations properties", () => {
      const prompts = [];
      const result = codeAdapter(prompts);
      expect(result).toHaveProperty("functions");
      expect(result).toHaveProperty("declarations");
      expect(Array.isArray(result.functions)).toBe(true);
      expect(typeof result.declarations).toBe("object");
    });

    test("should handle an empty array of prompts", () => {
      const prompts = [];
      const result = codeAdapter(prompts);
      expect(result.functions).toHaveLength(0);
      expect(Object.keys(result.declarations)).toHaveLength(0);
    });

    test("should correctly identify and categorize code snippets", () => {
      const prompts = [];
      const result = codeAdapter(prompts);
      expect(result.functions).toHaveLength(1);
      expect(Object.keys(result.declarations)).toHaveLength(2);
    });
  });

  describe("typeCheck", () => {
    test("should identify a function code snippet", () => {
      const functionSnippet = "";
      expect(typeCheck(functionSnippet)).toBe("function");
    });

    test("should identify a declaration code snippet", () => {
      const declarationSnippet = "";
      expect(typeCheck(declarationSnippet)).toBe("declaration");
    });

    test("should identify a class declaration code snippet", () => {
      const classSnippet = "";
      expect(typeCheck(classSnippet)).toBe("declaration");
    });

    test("should return null for an unknown code snippet type", () => {
      const unknownSnippet = "invalid code snippet";
      expect(typeCheck(unknownSnippet)).toBeNull();
    });
  });

  describe("createAPI", () => {
    test("should create an API object using functions and declarations", () => {
      const functions = [];
      const declarations = {};
      const api = createAPI(functions, declarations);
      expect(typeof api).toBe("object");
    });

    test("should handle empty functions and declarations", () => {
      const functions = [];
      const declarations = {};
      const api = createAPI(functions, declarations);
      expect(typeof api).toBe("object");
    });
  });

  describe("createProject", () => {
    test("should create a project object with the provided API", () => {
      const api = {};
      const project = createProject(api);
      expect(project).toHaveProperty("nucleoid");
      expect(project.nucleoid).toHaveProperty("api");
      expect(project.nucleoid.api).toEqual(api);
    });
  });
});
