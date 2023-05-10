import React from "react";
import StyledTreeItem from "./StyledTreeItem";
import clsx from "clsx";
import { useTreeItem } from "@mui/lab";

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
  } = props;

  const {
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (event) => {
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.focused]: focused,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleSelectionClick}
      ref={ref}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <div className={classes.label}>{label}</div>
    </div>
  );
});

const NonExpandableTreeItem = (props) => {
  return (
    <StyledTreeItem ContentComponent={NonExpandableTreeContent} {...props} />
  );
};

export default NonExpandableTreeItem;
