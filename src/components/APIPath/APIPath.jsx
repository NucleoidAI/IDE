import LanguageIcon from "@mui/icons-material/Language";
import styles from "./styles";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const APIPath = ({
  method,
  path,
  methodRef,
  pathRef,
  onTypesButtonClick,
  allowedMethods,
  isMethodDisabled,
  isPathDisabled,
  validatePath,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(
    allowedMethods.includes(method) ? method : allowedMethods[0] || ""
  );
  const [selectedPath, setSelectedPath] = useState("");

  useEffect(() => {
    methodRef.current = selectedMethod;
    pathRef.current = path + (path !== "/" ? "/" : "") + selectedPath;
    validatePath(selectedPath);
  }, [selectedMethod, selectedPath, methodRef, pathRef, path, validatePath]);

  return (
    <Grid container sx={styles.root}>
      <Grid sx={styles.firstElement} />
      <Grid item>
        <Grid container item sx={styles.content}>
          {isMethodDisabled ? (
            <Typography data-cy="method-text">{method}</Typography>
          ) : (
            <Select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              data-cy="method-select"
            >
              {allowedMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {method}
                </MenuItem>
              ))}
            </Select>
          )}
          <Box component="span" sx={styles.text}></Box>
          <Typography data-cy="path-text">
            {path} {path !== "/" ? "/" : ""}
          </Typography>
          {!isPathDisabled && (
            <TextField
              value={selectedPath}
              onChange={(e) => setSelectedPath(e.target.value)}
              data-cy="path-input"
            />
          )}
        </Grid>
      </Grid>
      <Button onClick={onTypesButtonClick} data-cy="types-button">
        <LanguageIcon sx={styles.icon} />
        Types
      </Button>
    </Grid>
  );
};

export default APIPath;
