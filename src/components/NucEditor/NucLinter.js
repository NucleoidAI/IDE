import * as ts from "typescript";

export class NucLinter {
  constructor(code) {
    this.code = code;
    this.diagnostics = [];
    this.ast = null;
  }

  parseCodeToAST() {
    this.ast = ts.createSourceFile(
      "code.ts",
      this.code,
      ts.ScriptTarget.Latest,
      true
    );
  }

  findInlineFunctions(node) {
    if (
      node.kind === ts.SyntaxKind.ArrowFunction ||
      node.kind === ts.SyntaxKind.FunctionExpression
    ) {
      this.diagnostics.push({
        message: "Inline function detected",
        index: node.pos,
        length: node.end - node.pos,
        severity: "warning",
      });
    }

    node.forEachChild((child) => this.findInlineFunctions(child));
  }

  checkForHelloWorld() {
    const helloWorldRegex = /hello world/gi;
    let match;
    while ((match = helloWorldRegex.exec(this.code)) !== null) {
      this.diagnostics.push({
        message: "You literally are not allowed to say hello world",
        index: match.index,
        length: match[0].length,
        severity: "warning",
      });
    }
  }

  lint() {
    this.checkForHelloWorld();
    this.parseCodeToAST();

    if (this.ast) {
      this.ast.forEachChild((child) => {});
    }

    return this.diagnostics;
  }
}
