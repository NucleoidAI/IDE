import React from "react";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { TreeItem, useTreeItem } from "@mui/lab";

const NonExpandableTreeContent = React.forwardRef(function CustomContent(
  props,
  ref
) {
  const {
    classes,
    className,
    label,
    nodeId,
    icon: iconProp,
    expansionIcon,
    displayIcon,
    onClick,
  } = props;

  const { disabled, expanded, handleExpansion, preventSelection } =
    useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      onContextMenu={onClick}
      ref={ref}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography component="div" className={classes.label}>
        {label}
      </Typography>
    </div>
  );
});

const NonExpandableFunctionTreeItem = (props) => (
  <TreeItem ContentComponent={NonExpandableTreeContent} {...props} />
);

export default NonExpandableFunctionTreeItem;
