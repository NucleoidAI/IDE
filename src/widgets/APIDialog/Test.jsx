import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import { useState } from "react";
import { Button, TextField } from "@mui/material";
import { TreeItem, TreeView } from "@mui/lab/";

const data = {
  name: "Adresses",
  type: "array",
  properties: [
    {
      name: "Adress",
      type: "object",
      properties: [
        { name: "title", type: "string" },
        { name: "code", type: "number" },
        { name: "adress", type: "string" },
        {
          name: "UserList",
          type: "array",
          properties: [
            {
              name: "User",
              type: "object",
              properties: [
                {
                  name: "name",
                  type: "string",
                },
                {
                  name: "age",
                  type: "number",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const RecursiveTree = ({ node, onChange, focusedNode, setFocusedNode }) => (
  <TreeItem
    nodeId={node.name}
    label={
      <EditableLabel
        property={node}
        onChange={onChange}
        onFocus={() => setFocusedNode(node.name)}
        onBlur={() => setFocusedNode(null)}
        isFocused={focusedNode === node.name}
      />
    }
  >
    {Array.isArray(node.properties) &&
      node.properties.map((property, index) => (
        <RecursiveTree
          key={index}
          node={property}
          onChange={onChange}
          focusedNode={focusedNode}
          setFocusedNode={setFocusedNode}
        />
      ))}
  </TreeItem>
);

const EditableLabel = ({ property, onChange }) => {
  const { name, type } = property;

  return (
    <div>
      <TextField
        value={name}
        onChange={(e) => onChange(property, "name", e.target.value)}
      />
      <span>:</span>
      <TextField
        value={type}
        onChange={(e) => onChange(property, "type", e.target.value)}
      />
    </div>
  );
};

const AdressTree = () => {
  const [treeData, setTreeData] = useState(data);
  const [focusedNode, setFocusedNode] = useState(null);

  const handlePropertyChange = (node, propertyKey, newValue) => {
    const updateData = (nodeToUpdate) => {
      if (nodeToUpdate === node) {
        return { ...node, [propertyKey]: newValue };
      }
      if (Array.isArray(nodeToUpdate.properties)) {
        return {
          ...nodeToUpdate,
          properties: nodeToUpdate.properties.map(updateData),
        };
      }
      return nodeToUpdate;
    };

    setTreeData(updateData(treeData));
  };

  return (
    <>
      <TreeView
        defaultCollapseIcon={<ArrowDropDownIcon />}
        defaultExpandIcon={<ArrowRightIcon />}
      >
        <RecursiveTree
          node={treeData}
          onChange={handlePropertyChange}
          focusedNode={focusedNode}
          setFocusedNode={setFocusedNode}
        />
      </TreeView>
      <Button onClick={() => console.log(treeData)}>a</Button>
    </>
  );
};

export default AdressTree;
