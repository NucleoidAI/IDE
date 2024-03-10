import * as ts from "typescript";
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

function extractClassName(classDefinition) {
  const match = classDefinition.match(/class\s+(\w+)/);
  return match ? match[1] : "";
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
export { typeCheck, extractCodeSnippet, extractCodeSnippets };
