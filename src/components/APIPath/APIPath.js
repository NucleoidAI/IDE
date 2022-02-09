import LanguageIcon from "@mui/icons-material/Language";
import methods from "../../utils/constants/methods";
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
import { checkPathUsed, splitPathPrefixAndSuffix } from "../../utils/Path";
import { forwardRef, useState } from "react";

const APIPath = forwardRef(({ setApiDialogView, view, path, method }, ref) => {
  const [alert, setAlert] = useState();
  const prefix = splitPathPrefixAndSuffix(path)[0];
  const suffix = splitPathPrefixAndSuffix(path)[1];

  const pathNames = Object.keys(ref.current);

  const handleCheck = (value) => {
    setAlert(checkPathUsed(pathNames, prefix, suffix, value));
  };

  return (
    <Grid container sx={styles.root}>
      <Grid sx={styles.firstElement} />
      <Grid item>
        <Grid container item sx={styles.content}>
          <FormControl variant={"outlined"} size={"small"}>
            <Select value={method}>
              {Object.keys(methods).map((item, index) => {
                return (
                  <MenuItem value={item} key={index}>
                    {methods[item]}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box component={"span"} sx={styles.text}>
            &nbsp;&nbsp;&nbsp;{prefix}&nbsp;
          </Box>
          <TextField
            defaultValue={suffix}
            onChange={(e) => handleCheck(e.target.value)}
            sx={styles.textfield}
            style={alert ? { backgroundColor: "red" } : null}
          />
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
});

export default APIPath;
