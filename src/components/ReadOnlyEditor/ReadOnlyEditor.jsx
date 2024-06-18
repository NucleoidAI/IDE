import "highlight.js/styles/github-dark.css";

import EditIcon from "@mui/icons-material/Edit";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import hljs from "highlight.js";

import { Box, Collapse, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import * as prettierStandalone from "prettier/standalone";
import * as typescriptPlugin from "prettier/parser-typescript";

const ReadOnlyEditor = ({
  title = "Code",
  language,
  value,
  onActionClick,
  isCollapsed,
}) => {
  const codeRef = useRef(null);
  const [collapsed, setCollapsed] = useState(isCollapsed);

  useEffect(() => {
    if (codeRef.current) {
      if (codeRef.current.dataset.highlighted === "yes") {
        delete codeRef.current.dataset.highlighted;
      }
      hljs.highlightElement(codeRef.current);
    }
  }, [language, value]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  let formattedCode;
  try {
    formattedCode = prettierStandalone.format(value, {
      parser: "typescript",
      plugins: [typescriptPlugin],
      singleQuote: true,
    });
  } catch (error) {
    console.error("Error formatting code with Prettier:", error);
    formattedCode = value; // Fall back to the original code if formatting fails
  }

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
          {title}
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
        <Stack
          component="code"
          ref={codeRef}
          className={language}
          data-cy="code-block"
          sx={{ whiteSpace: "pre-wrap" }} // Ensure the code retains formatting
        >
          {formattedCode}
        </Stack>
      </Collapse>
    </Stack>
  );
};

export default ReadOnlyEditor;
