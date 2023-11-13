import * as ts from "typescript";

const getClassFunctions = (functions) => {
  return functions
    .filter((func) => func.type === "CLASS")
    .map((func) => func.definition);
};

const resolveType = (type, classNameToStructureMap) => {
  if (typeof type === "string") {
    if (classNameToStructureMap[type]) {
      return { type: "ref", ref: type };
    } else {
      return { type };
    }
  } else if (Array.isArray(type)) {
    const itemType = resolveType(type[0], classNameToStructureMap);
    return {
      type: "array",
      items: { ...itemType, name: type[0] },
    };
  } else {
    throw new Error("Type structure not recognized");
  }
};

const resolveProperties = (properties, classNameToStructureMap) => {
  return Object.keys(properties).map((propName) => {
    const propType = properties[propName];
    return {
      name: propName,
      ...resolveType(propType, classNameToStructureMap),
    };
  });
};

function resolveNestedClasses(classStructures) {
  const classNameToStructureMap = classStructures.reduce((acc, structure) => {
    acc[structure.typeName] = structure.typeDefinition[structure.typeName];
    return acc;
  }, {});

  return classStructures.map((structure) => {
    const resolvedProperties = resolveProperties(
      structure.typeDefinition[structure.typeName],
      classNameToStructureMap
    );
    return {
      name: structure.typeName,
      type: "TS",
      schema: {
        name: structure.typeName,
        type: "object",
        properties: resolvedProperties,
      },
    };
  });
}

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
          let propType = member.type.getText(sourceFile);

          if (member.type.kind === ts.SyntaxKind.ArrayType) {
            const arrayType = member.type.elementType;
            propType = [arrayType.getText(sourceFile)];
          }

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
  return resolveNestedClasses(transformedClassesUsingTS);
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
