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

export const addProperty = (parentId = null, setSchemaData) => {
  const addPropertyToNode = (node, parentId) => {
    if (node.id === parentId) {
      const propertyCount = node.properties ? node.properties.length : 0;
      const newName = propertyCount === 0 ? "id" : `prop${propertyCount + 1}`;
      const newType = "string";

      const newProperty = {
        name: newName,
        type: newType,
        id: uuidv4(),
      };

      const updatedProperties = node.properties
        ? [...node.properties, newProperty]
        : [newProperty];

      return { ...node, properties: updatedProperties };
    } else if (node.properties) {
      const updatedProperties = node.properties.map((childNode) =>
        addPropertyToNode(childNode, parentId)
      );
      return { ...node, properties: updatedProperties };
    }
    return node;
  };

  setSchemaData((currentData) => {
    if (!parentId) {
      const propertyCount = currentData.properties
        ? currentData.properties.length
        : 0;
      const newName = propertyCount === 0 ? "id" : `prop${propertyCount + 1}`;
      const newType = "string";

      const newProperty = {
        name: newName,
        type: newType,
        id: uuidv4(),
      };

      const updatedProperties = currentData.properties
        ? [...currentData.properties, newProperty]
        : [newProperty];

      return {
        ...currentData,
        properties: updatedProperties,
      };
    } else {
      return addPropertyToNode(currentData, parentId);
    }
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

      if (changes.type === "object") {
        if (!updatedNode.properties || updatedNode.properties.length === 0) {
          updatedNode.properties = [
            { name: "id", type: "string", id: uuidv4() },
          ];
        }
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
    return updateProperty(currentData, propertyId, changes);
  });
};
