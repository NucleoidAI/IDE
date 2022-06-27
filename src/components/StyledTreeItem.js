import Box from "@mui/material/Box";
import React from "react";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";

const StyledTreeItemRoot = styled(TreeItem)(
  ({ theme, hovercolor, nocursor, selectedcolor }) => ({
    color: "black",

    [`& .${treeItemClasses.content}`]: {
      color: "black",
      "&:hover": {
        backgroundColor: hovercolor || theme.palette.action.hover,
      },
      "&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused": {
        backgroundColor:
          selectedcolor ||
          `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
      },
      [`& .${treeItemClasses.label}`]: {
        cursor: nocursor && "auto",
      },
    },
  })
);

function StyledTreeItem(props) {
  const {
    bgColor,
    color,
    labelIcon: LabelIcon,
    labelInfo,
    labelText,
    ...other
  } = props;

  return (
    <StyledTreeItemRoot
      label={
        <Box sx={{ display: "flex", alignItems: "center", p: 0.5, pr: 0 }}>
          <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </Box>
      }
      style={{
        "--tree-view-color": color,
        "--tree-view-bg-color": bgColor,
      }}
      {...other}
    />
  );
}

export default StyledTreeItem;
