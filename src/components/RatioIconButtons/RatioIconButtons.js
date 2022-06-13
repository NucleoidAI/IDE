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
        disabled={outputRatio === (0.25).toString()}
        onClick={() => {
          handleSetOutputRatio(0.25);
        }}
      >
        <WindowIconSmall disabled={outputRatio === (0.25).toString()} />
      </IconButton>
      <IconButton
        xs={styles.iconButton}
        disabled={outputRatio === (0.5).toString()}
        onClick={() => {
          handleSetOutputRatio(0.5);
        }}
      >
        <WindowIconMedium disabled={outputRatio === (0.5).toString()} />
      </IconButton>
      <IconButton
        xs={styles.iconButton}
        disabled={outputRatio === (0.75).toString()}
        onClick={() => {
          handleSetOutputRatio(0.75);
        }}
      >
        <WindowIconLarge disabled={outputRatio === (0.75).toString()} />
      </IconButton>
    </Box>
  );
};

export default RatioIconButtons;
