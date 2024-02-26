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

  lint() {
    this.parseCodeToAST();

    return this.diagnostics;
  }
}
