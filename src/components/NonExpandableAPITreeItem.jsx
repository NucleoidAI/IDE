import React from "react";
import ResourceMenu from "../widgets/ResourceMenu";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { useTheme } from "@mui/material/styles";

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

  const {
    disabled,
    expanded,
    selected,
    //  focused,
    handleExpansion,
    preventSelection,
  } = useTreeItem(nodeId);

  const icon = iconProp || expansionIcon || displayIcon;

  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState();

  const handleMouseDown = (event) => {
    preventSelection(event);
  };

  const handleExpansionClick = (event) => {
    handleExpansion(event);
  };

  const handleOpenResourceMenu = (e) => {
    e.preventDefault();
    setOpen(true);
    setAnchor(e);
  };

  const handleCloseResourceMenu = () => {
    setOpen(false);
  };
  const theme = useTheme();
  return (
    <div
      className={clsx(className, classes.root, {
        [classes.expanded]: expanded,
        [classes.selected]: selected,
        [classes.disabled]: disabled,
      })}
      onMouseDown={handleMouseDown}
      onContextMenu={handleOpenResourceMenu}
      ref={ref}
    >
      <div onClick={handleExpansionClick} className={classes.iconContainer}>
        {icon}
      </div>
      <Typography
        component="div"
        sx={{ bgcolor: open && theme.palette.custom.apiTreeRightClick }}
        className={classes.label}
      >
        {label}
      </Typography>

      <ResourceMenu
        anchor={anchor}
        openMenu={open}
        nodeId={label}
        handleClose={handleCloseResourceMenu}
        hash={onClick().hash}
        map={onClick().map}
      />
    </div>
  );
});

const NonExpandableAPITreeItem = (props) => (
  <TreeItem ContentComponent={NonExpandableTreeContent} {...props} />
);

export default NonExpandableAPITreeItem;
