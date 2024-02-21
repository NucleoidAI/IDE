import { TreeItem, treeItemClasses } from "@mui/lab";
import { alpha, styled } from "@mui/material/styles";

const CustomTreeItem = ({ label, ...otherProps }) => {
  const formattedLabel =
    label.length > 30 ? `${label.substring(0, 30)}..` : label;
  return <TreeItem label={formattedLabel} title={label} {...otherProps} />;
};

const LogicTreeItem = styled(CustomTreeItem)(() => ({
  [`& .${treeItemClasses.expanded}`]: {
    backgroundColor: alpha("#209958", 0.3),
    borderRadius: 10,
  },

  [`& .${treeItemClasses.focused}`]: {
    borderRadius: 10,
  },

  [`& .${treeItemClasses.label}`]: {
    width: "100%",
  },

  [`& .${treeItemClasses.root}`]: {
    width: "100%",
    [`& .${treeItemClasses.selected}`]: {
      backgroundColor: alpha("#209960", 0.1),
      borderRight: `2px solid ${alpha("#209958", 0.2)}`,
      borderBottom: `1px solid ${alpha("#209958", 0.2)}`,
      borderRadius: 10,
    },
  },

  [`& .${treeItemClasses.content}`]: {
    margin: 2,
    height: 40,
    width: "100%",
  },

  [`& .${treeItemClasses.group}`]: {
    height: 30,
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `2px solid ${alpha("#209958", 0.4)}`,
    borderTop: `1px solid ${alpha("#209958", 0.4)}`,
    borderRadius: 11,
  },
}));

export default LogicTreeItem;
