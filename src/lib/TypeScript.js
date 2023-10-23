import React from "react";
import { useContext } from "../context/context.jsx";

import * as ts from "typescript";

const getClassFunctions = () => {
  const [context] = useContext();
  const functions = context.get("nucleoid.functions");
  return functions
    .filter((func) => func.type === "CLASS")
    .map((func) => func.definition);
};

const transformClassDefinitionUsingTS = (classDef) => {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    classDef,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS
  );

  let output = null;

  const visitNode = (node) => {
    if (ts.isClassDeclaration(node) && node.name) {
      const className = node.name.text;
      const properties = {};

      node.members.forEach((member) => {
        if (ts.isPropertyDeclaration(member) && member.type) {
          const propName = member.name.getText(sourceFile);
          const propType = member.type.getText(sourceFile);
          properties[propName] = propType;
        }
      });

      output = {
        typeName: className,
        typeDefinition: {
          [className]: properties,
        },
      };
    }
    ts.forEachChild(node, visitNode);
  };

  visitNode(sourceFile);

  return output;
};

const transformAllClassesUsingTS = (classes) => {
  return classes.reduce((acc, classDef) => {
    const classInfo = transformClassDefinitionUsingTS(classDef);
    if (classInfo) {
      acc.push(classInfo);
    }
    return acc;
  }, []);
};

const getTypes = () => {
  const classFunctions = getClassFunctions();
  const transformedClassesUsingTS = transformAllClassesUsingTS(classFunctions);
  console.log("transformedClassesUsingTS", transformedClassesUsingTS);
  return transformedClassesUsingTS;
};

export default {
  getTypes,
};
