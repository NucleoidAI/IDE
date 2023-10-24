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

const resolveNestedClasses = (classStructures) => {
  const classNameToStructureMap = {};

  classStructures.forEach((structure) => {
    const className = structure.typeName;
    classNameToStructureMap[className] = structure.typeDefinition[className];
  });

  const resolvePropertyType = (propType, depth = 0) => {
    if (depth > 1 || !classNameToStructureMap.hasOwnProperty(propType)) {
      return propType;
    }

    return Object.fromEntries(
      Object.entries(classNameToStructureMap[propType]).map(([name, type]) => [
        name,
        resolvePropertyType(type, depth + 1),
      ])
    );
  };

  classStructures.forEach((structure) => {
    const properties = structure.typeDefinition[structure.typeName];
    for (const propName in properties) {
      properties[propName] = resolvePropertyType(properties[propName], 1);
    }
  });

  return classStructures;
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

const toOpenApiType = (type) => {
  switch (type) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";

    default:
      return { type: "object", properties: type };
  }
};

const getTypes = () => {
  const classFunctions = getClassFunctions();
  const transformedClassesUsingTS = transformAllClassesUsingTS(classFunctions);
  const resolvedClassStructures = resolveNestedClasses(
    transformedClassesUsingTS
  );

  return resolvedClassStructures;
};

const getOpenApiSchemas = () => {
  const classStructures = getTypes();

  const openApiSchemas = {};

  classStructures.forEach((structure) => {
    const className = structure.typeName;
    openApiSchemas[className] = {
      type: "object",
      properties: {},
    };
  });

  classStructures.forEach((structure) => {
    const className = structure.typeName;
    const properties = structure.typeDefinition[className];
    const schema = openApiSchemas[className];

    for (const [propName, propType] of Object.entries(properties)) {
      if (typeof propType === "object" && !Array.isArray(propType)) {
        const matchingClass = classStructures.find(
          (struct) =>
            JSON.stringify(struct.typeDefinition[struct.typeName]) ===
            JSON.stringify(propType)
        );

        if (matchingClass) {
          schema.properties[propName] = {
            $ref: `#/components/schemas/${matchingClass.typeName}`,
          };
        } else {
          schema.properties[propName] = propType;
        }
      } else {
        schema.properties[propName] = toOpenApiType(propType);
      }
    }
  });

  return openApiSchemas;
};

export default {
  getTypes,
  getOpenApiSchemas,
};
