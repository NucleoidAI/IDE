import LanguageIcon from "@mui/icons-material/Language";
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

  const [isValidName, setIsValidName] = useState(false);

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

  const setPathSuffix = (value) => {
    if (value === suffix) {
      return null;
    }

    if (value === "") {
      if (
        usedNames.find(
          (item) => item === prefix.substring(0, prefix.length - 1) + value
        )
      ) {
        setIsValidName(true);
        return null;
      }
    }
    if (usedNames.find((item) => item === prefix + value)) {
      setIsValidName(true);
      return null;
    }
    setIsValidName(false);
  };

  return (
    <Grid container sx={styles.root}>
      <Grid sx={styles.firstelement} />
      <Grid item>
        <Grid container item sx={styles.content}>
          <FormControl variant={"outlined"} size={"small"}>
            <Select value={"get"}>
              <MenuItem value={"get"}>GET</MenuItem>
              <MenuItem value={"post"}>POST</MenuItem>
            </Select>
          </FormControl>
          <Box component={"span"} sx={styles.text}>
            &nbsp;&nbsp;&nbsp;{prefix}&nbsp;
          </Box>
          <TextField
            defaultValue={suffix}
            onChange={(e) => setPathSuffix(e.target.value)}
            sx={styles.textfield}
            style={isValidName ? { backgroundColor: "red" } : null}
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
