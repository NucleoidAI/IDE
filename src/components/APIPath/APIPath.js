import LanguageIcon from "@mui/icons-material/Language";
import methods from "./methods";
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
import { forwardRef, useState } from "react";

const APIPath = forwardRef(({ setApiDialogView, view, path, method }, ref) => {
  const pathArr = path.split("/").filter(Boolean);

  const [isValidSuffix, setIsValidSuffix] = useState(true);

  const suffix = pathArr.pop();

  let prefix = "/";
  pathArr.forEach((item) => {
    prefix += item + "/";
  });

  const usedNames = Object.keys(ref.current).filter(
    (item) =>
      item.substring(0, prefix.length - 1) ===
      prefix.substring(0, prefix.length - 1)
  );

  const checkSuffixUse = (value) => {
    if (value === suffix) {
      return null;
    }

    if (value === "") {
      if (
        usedNames.find(
          (item) => item === prefix.substring(0, prefix.length - 1) + value
        )
      ) {
        setIsValidSuffix(false);
        return null;
      }
    }
    if (usedNames.find((item) => item === prefix + value)) {
      setIsValidSuffix(false);
      return null;
    }

    setIsValidSuffix(true);
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
            onChange={(e) => checkSuffixUse(e.target.value)}
            sx={styles.textfield}
            style={isValidSuffix ? null : { backgroundColor: "red" }}
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
