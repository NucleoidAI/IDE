import "highlight.js/styles/github-dark.css";
import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import hljs from "highlight.js";
import { Box, Collapse, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import * as prettierStandalone from "prettier/standalone";
import * as typescriptPlugin from "prettier/parser-typescript";

const ReadOnlyEditor = ({ language, value, onActionClick, isCollapsed }) => {
  const codeRef = useRef(null);
  const [collapsed, setCollapsed] = useState(isCollapsed);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [language, value]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Stack
      sx={{
        bgcolor: (theme) => theme.palette.custom.drawerBG,
      }}
    >
      <Stack
        color={(theme) => theme.palette.custom.textGray}
        direction="row"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mx: 2,
        }}
      >
        <Typography m={0.4} variant="subtitle">
          Code
        </Typography>
        <Box>
          <IconButton onClick={toggleCollapse}>
            {collapsed ? (
              <ExpandMoreIcon fontSize="small" />
            ) : (
              <ExpandLessIcon fontSize="small" />
            )}
          </IconButton>
          <IconButton onClick={onActionClick}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </Stack>
      <Collapse in={!collapsed}>
        <Stack component="code" ref={codeRef} className={language}>
          {prettierStandalone.format(value, {
            parser: "typescript",
            plugins: [typescriptPlugin],
            singleQuote: true,
          })}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default ReadOnlyEditor;
