import React from "react";
import styles from "./styles";
import { Box, IconButton } from "@mui/material";

import {
  WindowIconLarge,
  WindowIconMedium,
  WindowIconSmall,
} from "../../icons/window/WindowIcon";

const RatioIconButtons = ({ outputRatio, handleSetOutputRatio }) => {
  return (
    <Box sx={styles.root}>
      <IconButton
        xs={styles.iconButton}
        disabled={outputRatio === 0.25}
        onClick={() => {
          handleSetOutputRatio(0.25);
        }}
      >
        <WindowIconSmall disabled={outputRatio === 0.25} />
      </IconButton>
      <IconButton
        xs={styles.iconButton}
        disabled={outputRatio === 0.5}
        onClick={() => {
          handleSetOutputRatio(0.5);
        }}
      >
        <WindowIconMedium disabled={outputRatio === 0.5} />
      </IconButton>
      <IconButton
        xs={styles.iconButton}
        disabled={outputRatio === 0.75}
        onClick={() => {
          handleSetOutputRatio(0.75);
        }}
      >
        <WindowIconLarge disabled={outputRatio === 0.75} />
      </IconButton>
    </Box>
  );
};

export default RatioIconButtons;
