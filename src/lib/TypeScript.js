import * as ts from "typescript";

const getClassFunctions = (functions) => {
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
    if (
      depth > 1 ||
      !Object.prototype.hasOwnProperty.call(classNameToStructureMap, propType)
    ) {
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

function getTypes(functions) {
  const classFunctions = getClassFunctions(functions);
  const transformedClassesUsingTS = transformAllClassesUsingTS(classFunctions);
  const resolvedClassStructures = resolveNestedClasses(
    transformedClassesUsingTS
  );
  resolvedClassStructures.forEach((structure) => {
    structure.src = "typescript";
  });

  return resolvedClassStructures.map((structure) => ({
    name: structure.typeName,
    type: structure.src.toUpperCase(),
    schema: {
      type: "object",
      properties: structure.typeDefinition[structure.typeName],
    },
  }));
}

const getOpenApiSchemas = () => {
  const classStructures = getTypes();

  classStructures.forEach((structure) => {
    const properties = structure.schema.properties;
    for (const [propName, propType] of Object.entries(properties)) {
      if (typeof propType === "object" && !Array.isArray(propType)) {
        const matchingClass = classStructures.find(
          (struct) =>
            JSON.stringify(struct.schema.properties) ===
            JSON.stringify(propType)
        );

        if (matchingClass) {
          properties[propName] = {
            $ref: `#/components/schemas/${matchingClass.name}`,
          };
        } else {
          properties[propName] = propType;
        }
      } else {
        properties[propName] = toOpenApiType(propType);
      }
    }
  });

  return classStructures;
};

export { getTypes, getOpenApiSchemas };
