const ts = require("typescript");

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

module.exports = { typeCheck };
