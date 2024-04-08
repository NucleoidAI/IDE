import Handlebars from "handlebars";
import apiTemplates from "../templates/apiTemplates";

import * as ts from "typescript";

Handlebars.registerHelper("camelCase", function (str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
});

Handlebars.registerHelper("encloseBraces", function (str) {
  return `{${str}Id}`;
});

function createASTFromCode(code) {
  return ts.createSourceFile("temp.ts", code, ts.ScriptTarget.Latest, true);
}

function typeCheck(codeSnippet) {
  try {
    const sourceFile = createASTFromCode(codeSnippet);

    const visit = (node) => {
      if (ts.isFunctionDeclaration(node)) {
        return "function";
      } else if (ts.isClassDeclaration(node)) {
        return "class";
      } else if (
        ts.isVariableStatement(node) ||
        (ts.isExpressionStatement(node) &&
          ((ts.isCallExpression(node.expression) &&
            node.expression.expression.text === "use") ||
            ts.isBinaryExpression(node.expression)))
      ) {
        return "declaration";
      }

      return ts.forEachChild(node, visit);
    };

    const result = visit(sourceFile);

    return result !== undefined ? result : null;
  } catch (error) {
    return null;
  }
}

function createObject(codeSnippet) {
  const codeType = typeCheck(codeSnippet);

  if (codeType === "function") {
    return {
      path: "",
      params: [],
      type: "FUNCTION",
      definition: codeSnippet,
    };
  } else if (codeType === "class") {
    const className = extractClassName(codeSnippet);
    const constructorParams = extractConstructorParams(codeSnippet);

    return {
      path: className,
      params: constructorParams,
      type: "CLASS",
      definition: codeSnippet,
    };
  } else if (codeType === "declaration") {
    return {
      description: "",
      summary: "",
      definition: codeSnippet,
    };
  }

  return null;
}

function createCodeSnippets(codeBlock) {
  const declarationSnippets = [];
  const functionSnippets = [];

  const sourceFile = createASTFromCode(codeBlock);

  const firstLine = sourceFile.getChildAt(0).getFullText(sourceFile).trim();
  const isDeclarative = firstLine.includes("declarative");

  function visit(node) {
    if (isDeclarative && ts.isExpressionStatement(node)) {
      const expression = node.expression;
      if (
        ts.isBinaryExpression(expression) &&
        expression.left.getText(sourceFile).startsWith("$")
      ) {
        declarationSnippets.push(node.getText(sourceFile));
      }
    } else {
      if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
        functionSnippets.push(node.getText(sourceFile));
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return {
    declarationSnippets,
    functionSnippets,
  };
}

function extractCodeBlocks(messages) {
  const codeBlocks = [];

  messages.forEach((message) => {
    if (message.code) {
      codeBlocks.push(message.code);
    }
  });

  return codeBlocks;
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
        singularName: className,
        pluralName: `${className.toLowerCase()}s`,
        properties,
      };

      const listObjectsTemplate = Handlebars.compile(apiTemplates.listObjects);
      const createObjectTemplate = Handlebars.compile(
        apiTemplates.createObject
      );
      const readObjectTemplate = Handlebars.compile(apiTemplates.readObject);

      const listObjectsAPI = listObjectsTemplate(context);
      const createObjectAPI = createObjectTemplate(context);
      const readObjectAPI = readObjectTemplate(context);

      api.push(
        JSON.parse(listObjectsAPI),
        JSON.parse(createObjectAPI),
        JSON.parse(readObjectAPI)
      );
    }
  });

  return api;
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

function exportProject(chat) {
  const { id, messages } = chat;

  const codeBlocks = extractCodeBlocks(messages);

  const functionSnippets = [];
  const declarationSnippets = [];

  codeBlocks.forEach((codeBlock) => {
    const { functionSnippets: functions, declarationSnippets: declarations } =
      createCodeSnippets(codeBlock);
    functionSnippets.push(...functions);
    declarationSnippets.push(...declarations);
  });

  const functions = functionSnippets.map((snippet) => createObject(snippet));
  const declarations = declarationSnippets.map((snippet) =>
    createObject(snippet)
  );

  const api = createAPI(functions);

  const project = {
    context: {
      project: {
        type: "chat",
        id: id,
        name: "Chat Project",
        description: "This project has been converted from chat",
      },
      api: api,
      functions: functions,
      declarations: declarations,
    },
  };

  const projectJSON = JSON.stringify(project);

  const key = `ide.projects.${id}`;

  localStorage.setItem(key, projectJSON);
}

function compile() {}

export {
  typeCheck,
  createObject,
  createCodeSnippets,
  extractCodeBlocks,
  createAPI,
  exportProject,
  compile,
};
