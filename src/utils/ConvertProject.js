import Handlebars from "handlebars";

import * as ts from "typescript";

Handlebars.registerHelper("camelCase", function (str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
});

function typeCheck(codeSnippet) {
  try {
    const sourceFile = ts.createSourceFile(
      "snippet.ts",
      codeSnippet,
      ts.ScriptTarget.Latest,
      true
    );

    let result = null;

    function visit(node) {
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
    }

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
    return {
      path: className,
      params: [],
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

const apiTemplates = {
  listObjects: `
    {
      "path": "/{{pluralName}}",
      "method": "GET",
      "params": [],
      "response": {
        "type": "OPENAPI",
        "schema": {
          "name": "{{className}}",
          "type": "object",
          "properties": [
            {{#each properties}}
            {
              "name": "{{name}}",
              "type": "{{type}}"
            }{{#unless @last}},{{/unless}}
            {{/each}}
          ]
        }
      },
      "summary": "List {{pluralName}}",
      "description": "List {{pluralName}}",
      "x-nuc-action": "function action() { return {{className}}; }"
    }
  `,
  createObject: `
    {
      "path": "/{{pluralName}}",
      "method": "POST",
      "params": [],
      "request": {
        "type": "OPENAPI",
        "schema": {
          "type": "object",
          "properties": [
            {{#each properties}}
            {
              "name": "{{name}}",
              "type": "{{type}}"
            }{{#unless @last}},{{/unless}}
            {{/each}}
          ]
        }
      },
      "response": {
        "type": "OPENAPI",
        "schema": {
          "name": "{{className}}",
          "type": "object",
          "properties": [
            {{#each properties}}
            {
              "name": "{{name}}",
              "type": "{{type}}"
            }{{#unless @last}},{{/unless}}
            {{/each}}
          ]
        }
      },
      "summary": "Create a {{singularName}}",
      "description": "Create a {{singularName}}",
      "x-nuc-action": "function action(req) { const {{camelCase singularName}}Data = req.body; return new {{className}}({{#each properties}}{{camelCase ../singularName}}Data.{{name}}{{#unless @last}}, {{/unless}}{{/each}}); }"
    }
  `,
  readObject: `
    {
      "path": "/{{pluralName}}/{{{&#8203}};{{singularName}}Id&#8203}",
      "method": "GET",
      "params": [
        {
          "name": "{{camelCase singularName}}Id",
          "in": "path",
          "type": "string",
          "required": true,
          "description": "{{singularName}} ID"
        }
      ],
      "response": {
        "type": "OPENAPI",
        "schema": {
          "name": "{{className}}",
          "type": "object",
          "properties": [
            {{#each properties}}
            {
              "name": "{{name}}",
              "type": "{{type}}"
            }{{#unless @last}},{{/unless}}
            {{/each}}
          ]
        }
      },
      "summary": "Read a {{singularName}}",
      "description": "Read a {{singularName}}",
      "x-nuc-action": "function action(req) { const {{camelCase singularName}}Id = req.params.{{camelCase singularName}}Id; return {{className}}[{{camelCase singularName}}Id]; }"
    }
  `,
};

function createAPI(functions, declarations) {
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
  const properties = [];
  const lines = classDefinition.split("\n");

  lines.forEach((line) => {
    const match = line.match(/(\w+):\s*(\w+)/);
    if (match) {
      const name = match[1];
      const type = match[2];
      properties.push({ name, type });
    }
  });

  return properties;
}
export { typeCheck, extractCodeSnippet, extractCodeSnippets, createAPI };
