import LanguageIcon from "@mui/icons-material/Language";
import React from "react";
import styles from "./styles";
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

function APIPath({ setApiDialogView, view }) {
  return (
    <Grid container sx={styles.root}>
      <Grid sx={styles.firstElement} />
      <Grid item>
        <Grid container item sx={styles.content}>
          <FormControl variant={"outlined"} size={"small"}>
            <Select value={"get"}>
              <MenuItem value={"get"}>GET</MenuItem>
              <MenuItem value={"post"}>POST</MenuItem>
            </Select>
          </FormControl>
          <Box component={"span"} sx={styles.text}>
            &nbsp;&nbsp;&nbsp;/devices/devicesId/items/&nbsp;
          </Box>
          <TextField defaultValue={"itemId"} sx={styles.textfield} />
        </Grid>
      </Grid>
      <Button
        variant={view === "TYPES" ? "contained" : "outlined"}
        onClick={() => setApiDialogView("TYPES")}
      >
        <LanguageIcon sx={styles.icon} />
        &nbsp;Types
      </Button>
    </Grid>
  );
}

export default APIPath;
