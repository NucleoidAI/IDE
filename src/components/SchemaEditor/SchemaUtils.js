import { v4 as uuidv4 } from "uuid";

export const getTypeStyle = (type) => {
  return {
    fontWeight: "normal",
    color: getTypeColor(type),
    marginLeft: "auto",
  };
};

const getTypeColor = (type) => {
  switch (type) {
    case "object":
      return "red";
    case "string":
      return "green";
    case "integer":
      return "blue";

    default:
      return "black";
  }
};

export const addProperty = (newProperty, parentId = null, setSchemaData) => {
  const addPropertyToNode = (node, parentId, newProperty) => {
    if (node.id === parentId) {
      const updatedProperties = node.properties
        ? [...node.properties, { ...newProperty, id: uuidv4() }]
        : [{ ...newProperty, id: uuidv4() }];

      return { ...node, properties: updatedProperties };
    }
    if (node.properties) {
      const updatedProperties = node.properties.map((childNode) =>
        addPropertyToNode(childNode, parentId, newProperty)
      );
      return { ...node, properties: updatedProperties };
    }
    return node;
  };

  setSchemaData((currentData) => {
    if (!parentId) {
      const updatedProperties = currentData.properties
        ? [...currentData.properties, { ...newProperty, id: uuidv4() }]
        : [{ ...newProperty, id: uuidv4() }];

      return {
        ...currentData,
        properties: updatedProperties,
      };
    }
    const updatedProperties = currentData.properties.map((node) =>
      addPropertyToNode(node, parentId, newProperty)
    );

    return {
      ...currentData,
      properties: updatedProperties,
    };
  });
};

export const removeProperty = (propertyId, setSchemaData) => {
  const removePropertyFromNode = (node, propertyId) => {
    if (node.id === propertyId) {
      return null;
    }
    if (node.properties) {
      const updatedProperties = node.properties
        .map((childNode) => removePropertyFromNode(childNode, propertyId))
        .filter((childNode) => childNode !== null);

      return { ...node, properties: updatedProperties };
    }
    return node;
  };
  setSchemaData((currentData) => {
    const updatedProperties = currentData.properties
      .map((node) => removePropertyFromNode(node, propertyId))
      .filter((node) => node !== null);
    const updatedData = { ...currentData, properties: updatedProperties };

    return updatedData;
  });
};

export const changeProperty = (propertyId, changes, setSchemaData) => {
  const updateProperty = (node, propertyId, changes) => {
    if (node.id === propertyId || propertyId === "1") {
      const updatedNode = {
        ...node,
        name: changes.name,
        type: changes.type,
      };

      if (changes.type === "object" && !updatedNode.properties) {
        updatedNode.properties = [];
      } else if (changes.type === "array") {
        if (updatedNode.properties) {
          updatedNode.properties = updatedNode.properties.slice(0, 1);
        } else {
          updatedNode.properties = [];
        }
      } else if (changes.type !== "object" && changes.type !== "array") {
        delete updatedNode.properties;
      }
      return updatedNode;
    }

    if (node.properties) {
      const updatedProperties = node.properties.map((childNode) =>
        updateProperty(childNode, propertyId, changes)
      );
      return { ...node, properties: updatedProperties };
    }
    return node;
  };

  setSchemaData((currentData) => {
    if (propertyId === "1") {
      return updateProperty(currentData, propertyId, changes);
    } else {
      const updatedProperties = currentData.properties.map((node) =>
        updateProperty(node, propertyId, changes)
      );
      return { ...currentData, properties: updatedProperties };
    }
  });
};
