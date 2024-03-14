import { v4 as uuidv4 } from "uuid";

import * as fs from "fs";
import * as ts from "typescript";

export class NucLinter {
  constructor(code) {
    this.code = code;
    this.diagnostics = [];
    this.ast = null;
    this.fileName = "code_" + uuidv4() + ".ts";
  }

  parseCodeToAST() {
    this.ast = ts.createSourceFile(
      this.fileName,
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

    setTimeout(() => {
      fs.unlink(this.fileName);
    }, 0);

    return this.diagnostics;
  }
}
