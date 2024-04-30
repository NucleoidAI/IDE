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

const APIPath = ({ method, path, methodRef, pathRef, onTypesButtonClick }) => {
  const [selectedMethod, setSelectedMethod] = useState(method);
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
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
            <MenuItem value="PUT">PUT</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
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
