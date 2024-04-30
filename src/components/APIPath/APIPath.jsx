import LanguageIcon from "@mui/icons-material/Language";
import styles from "./styles";

import { Box, Button, Grid, MenuItem, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

const APIPath = ({
  method,
  path,
  methodRef,
  pathRef,
  onTypesButtonClick,
  allowedMethods,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(
    allowedMethods.includes(method) ? method : allowedMethods[0] || ""
  );
  const [selectedPath, setSelectedPath] = useState(path);

  useEffect(() => {
    methodRef.current = selectedMethod;
    pathRef.current = selectedPath;
  }, [selectedMethod, selectedPath, methodRef, pathRef]);

  return (
    <Grid container sx={styles.root}>
      <Grid sx={styles.firstElement} />
      <Grid item>
        <Grid container item sx={styles.content}>
          <Select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
          >
            {allowedMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
          <Box component="span" sx={styles.text}></Box>
          <TextField
            value={selectedPath}
            onChange={(e) => setSelectedPath(e.target.value)}
          />
        </Grid>
      </Grid>
      <Button onClick={onTypesButtonClick}>
        <LanguageIcon sx={styles.icon} />
        Types
      </Button>
    </Grid>
  );
};

export default APIPath;
