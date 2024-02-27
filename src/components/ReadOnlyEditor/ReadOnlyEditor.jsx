import "highlight.js/styles/github-dark.css";

import hljs from "highlight.js";

import { Box, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";

const ReadOnlyEditor = ({ language, value, onActionClick, actionIcon }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    hljs.highlightBlock(codeRef.current);
  }, [language, value]);

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
        <Box
          component={actionIcon}
          onClick={onActionClick}
          sx={{
            "&:hover": {
              color: "gray",
              cursor: "pointer",
            },
          }}
        />{" "}
      </Stack>
      <Stack component="code" ref={codeRef} className={language}>
        {value}
      </Stack>
    </Stack>
  );
};

export default ReadOnlyEditor;
