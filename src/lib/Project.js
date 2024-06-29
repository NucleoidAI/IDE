import APITemplate from "../templates/APITemplate.js";
import Handlebars from "handlebars";
import pluralize from "pluralize";

import * as ts from "typescript";

Handlebars.registerHelper(
  "camelCase",
  (str) => str.charAt(0).toLowerCase() + str.slice(1)
);

Handlebars.registerHelper("pluralize", (str) => pluralize(str));

Handlebars.registerHelper("lowerCase", (str) => str.toLowerCase());

Handlebars.registerHelper(
  "camelCase",
  (str) => str.charAt(0).toLowerCase() + str.slice(1)
);

Handlebars.registerHelper("encloseBraces", (str) => `{${str}Id}`);

function createASTFromCode(code) {
  return ts.createSourceFile("temp.ts", code, ts.ScriptTarget.Latest, true);
}

function typeCheck(codeSnippet) {
  try {
    const sourceFile = createASTFromCode(codeSnippet);

    let result = null;

    const visit = (node) => {
      if (ts.isFunctionDeclaration(node)) {
        result = "function";
        return;
      } else if (ts.isClassDeclaration(node)) {
        result = "class";
        return;
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    if (result === null) {
      result = "declaration";
    }

    return result;
  } catch (error) {
    console.error("Error in typeCheck:", error);
    return null;
  }
}

function extractClassName(classDefinition) {
  const sourceFile = createASTFromCode(classDefinition);

  let className = "";

  function visit(node) {
    if (ts.isClassDeclaration(node)) {
      className = node.name.getText(sourceFile);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return className;
}

function extractFunctionName(functionDefinition) {
  const sourceFile = createASTFromCode(functionDefinition);
  let functionName = "";

  function visit(node) {
    if (ts.isFunctionDeclaration(node)) {
      functionName = node.name.getText(sourceFile);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return functionName;
}

function extractConstructorParams(classDefinition) {
  const sourceFile = createASTFromCode(classDefinition);

  let constructorParams = [];

  function visit(node) {
    if (ts.isConstructorDeclaration(node)) {
      const params = node.parameters.map((param) => {
        const name = param.name.getText(sourceFile);
        const type = param.type ? param.type.getText(sourceFile) : "any";
        return `${name}: ${type}`;
      });
      constructorParams = params;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return constructorParams;
}

function extractProperties(classDefinition) {
  const sourceFile = createASTFromCode(classDefinition);

  const properties = [];

  function visit(node) {
    if (ts.isPropertyDeclaration(node)) {
      const name = node.name.getText(sourceFile);
      const type = node.type ? node.type.getText(sourceFile) : "any";
      properties.push({ name, type });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return properties;
}

function createObject(codeSnippet) {
  const codeType = typeCheck(codeSnippet);

  if (codeType === "function") {
    const functionName = extractFunctionName(codeSnippet);
    return {
      path: "/" + functionName,
      params: [],
      type: "FUNCTION",
      definition: codeSnippet,
    };
  } else if (codeType === "class") {
    const className = extractClassName(codeSnippet);
    const constructorParams = extractConstructorParams(codeSnippet);

    return {
      path: "/" + className,
      params: constructorParams,
      type: "CLASS",
      definition: codeSnippet,
    };
  } else if (codeType === "declaration") {
    return {
      description: "",
      summary: codeSnippet.substring(0, 20),
      definition: codeSnippet,
    };
  }

  return null;
}

function createCodeSnippets(codeBlock) {
  const declarativeSnippets = [];
  const functions = [];
  const imperativeSnippets = [];

  let sourceFile = createASTFromCode(codeBlock);

  const firstStatement = sourceFile.statements[0];
  let isDeclarative = false;

  if (
    firstStatement &&
    ts.isExpressionStatement(firstStatement) &&
    ts.isStringLiteral(firstStatement.expression) &&
    firstStatement.expression.text === "use declarative"
  ) {
    isDeclarative = true;
  }
  const start = firstStatement.getStart();
  const end = firstStatement.getEnd();
  codeBlock = codeBlock.slice(0, start) + codeBlock.slice(end);

  sourceFile = createASTFromCode(codeBlock);

  function visit(node) {
    if (isDeclarative) {
      if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
        functions.push(node.getText(sourceFile));
      } else if (
        ts.isExpressionStatement(node) &&
        ts.isSourceFile(node.parent)
      ) {
        declarativeSnippets.push(node.getText(sourceFile));
      }
    } else {
      imperativeSnippets.push(node.getText(sourceFile));
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return {
    declarativeSnippets,
    imperativeSnippets,
    functions,
  };
}
function createAPI(functions) {
  const api = [];

  functions.forEach((func) => {
    if (func.type === "CLASS") {
      const classDefinition = func.definition;
      const className = extractClassName(classDefinition);
      const properties = extractProperties(classDefinition);

      const context = {
        className,
        properties,
      };

      api.push(
        ...[
          APITemplate.listObjects,
          APITemplate.createObject,
          APITemplate.readObject,
          APITemplate.updateObject,
          APITemplate.deleteObject,
        ]
          .map((template) => Handlebars.compile(template)(context))
          .map((apiObject) => JSON.parse(apiObject))
      );
    }
  });

  return api;
}

function compile(blocks) {
  const functions = [];
  const declarations = [];
  const imperatives = [];

  blocks.forEach((codeBlock) => {
    const {
      functions: extractedFunctions,
      declarativeSnippets,
      imperativeSnippets,
    } = createCodeSnippets(codeBlock);
    functions.push(
      ...extractedFunctions.map((snippet) => createObject(snippet))
    );
    declarations.push(
      ...declarativeSnippets.map((snippet) => createObject(snippet))
    );
    imperatives.push(...imperativeSnippets);
  });

  const uniqueFunctions = functions.reduceRight(
    (acc, func) =>
      acc.find((f) => f.path === func.path) ? acc : [func, ...acc],
    []
  );

  const uniqueDeclarations = declarations.reduceRight(
    (acc, dec) =>
      acc.find((d) => d.definition === dec.definition) ? acc : [dec, ...acc],
    []
  );

  const api = createAPI(uniqueFunctions);
  const rootString = Handlebars.compile(APITemplate.rootObject)({});
  api.unshift(JSON.parse(rootString));

  return {
    api,
    functions: uniqueFunctions,
    declarations: uniqueDeclarations,
    imperatives,
  };
}

export default { compile };
