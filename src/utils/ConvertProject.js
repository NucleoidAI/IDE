import Handlebars from "handlebars";
import apiTemplates from "../templates/apiTemplates";

import * as ts from "typescript";

Handlebars.registerHelper("camelCase", function (str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
});

Handlebars.registerHelper("encloseBraces", function (str) {
  return `{${str}Id}`;
});
function typeCheck(codeSnippet) {
  try {
    const sourceFile = ts.createSourceFile(
      "temp.ts",
      codeSnippet,
      ts.ScriptTarget.Latest,
      true
    );

    let result = null;

    const visit = (node) => {
      if (ts.isFunctionDeclaration(node)) {
        result = "function";
      } else if (ts.isClassDeclaration(node)) {
        result = "class";
      } else if (
        ts.isVariableStatement(node) ||
        (ts.isExpressionStatement(node) &&
          ((ts.isCallExpression(node.expression) &&
            node.expression.expression.text === "use") ||
            ts.isBinaryExpression(node.expression)))
      ) {
        result = "declaration";
      }

      if (result === null) {
        ts.forEachChild(node, visit);
      }
    };

    visit(sourceFile);

    return result;
  } catch (error) {
    return null;
  }
}

function extractCodeSnippet(codeSnippet, messageContent) {
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
      description: messageContent,
      summary: messageContent,
      definition: codeSnippet,
    };
  }

  return null;
}

function extractConstructorParams(classDefinition) {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    classDefinition,
    ts.ScriptTarget.Latest,
    true
  );

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

function extractCodeSnippets(messages) {
  const functions = [];
  const declarations = [];

  messages.forEach((message) => {
    if (message.code) {
      const codeSnippet = extractCodeSnippet(message.code, message.content);
      if (codeSnippet) {
        if (codeSnippet.type === "FUNCTION" || codeSnippet.type === "CLASS") {
          functions.push(codeSnippet);
        } else {
          declarations.push(codeSnippet);
        }
      }
    }
  });

  return { functions, declarations };
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
  const match = classDefinition.match(/class\s+(\w+)/);
  return match ? match[1] : "";
}

function extractProperties(classDefinition) {
  const propertySet = new Set();
  const properties = [];
  const lines = classDefinition.split("\n");

  lines.forEach((line) => {
    const match = line.match(/(\w+):\s*(\w+)/);
    if (match) {
      const name = match[1];
      const type = match[2];
      const propertyString = `${name}:${type}`;
      if (!propertySet.has(propertyString)) {
        propertySet.add(propertyString);
        properties.push({ name, type });
      }
    }
  });

  return properties;
}

function exportProject(chat) {
  const { id, messages } = chat;
  const { functions, declarations } = extractCodeSnippets(messages);
  const api = createAPI(functions);

  const project = {
    functions,
    declarations,
    api,
  };

  const projectJSON = JSON.stringify(project);

  const key = `project.${id}`;

  localStorage.setItem(key, projectJSON);
}

export {
  typeCheck,
  extractCodeSnippet,
  extractCodeSnippets,
  createAPI,
  exportProject,
};
