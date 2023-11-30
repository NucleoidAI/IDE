import ChevronRight from "@mui/icons-material/ChevronRight";
import ExpandMore from "@mui/icons-material/ExpandMore";
import React from "react";
import { TreeItem } from "@mui/lab";
import { TreeView } from "@mui/lab";
import { v4 as uuidv4 } from "uuid";

import { useEffect, useState } from "react";

const Schema = ({ initialData }) => {
  const [schemaData, setSchemaData] = useState([]);

  useEffect(() => {
    const addIdsToSchema = (schema) => {
      return {
        ...schema,
        id: uuidv4(),
        properties: schema.properties?.map(addIdsToSchema),
      };
    };

    if (initialData) {
      const dataWithIds = addIdsToSchema(initialData);
      setSchemaData(dataWithIds);
    }
  }, [initialData]);

  const renderTree = (node) => (
    <TreeItem
      key={node.id}
      nodeId={node.id}
      label={`${node.name} (${node.type})`}
    >
      {Array.isArray(node.properties)
        ? node.properties.map((childNode) => renderTree(childNode))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMore />}
      defaultExpandIcon={<ChevronRight />}
    >
      {schemaData?.properties?.map((node) => renderTree(node))}
    </TreeView>
  );
};

export default Schema;
