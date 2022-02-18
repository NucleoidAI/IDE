import Constants from "../../constants";
import LanguageIcon from "@mui/icons-material/Language";
import Path from "../../utils/Path";
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

import { forwardRef, useEffect, useRef, useState } from "react";

const APIPath = forwardRef(
  (
    {
      setApiDialogView,
      view,
      path,
      method,
      handleSaveButtonStatus,
      handleChangeMethod,
    },
    { apiRef, pathRef }
  ) => {
    const api = apiRef.current;
    const [alertPath, setAlertPath] = useState();
    const [alertMethod, setAlertMethod] = useState();
    const { prefix, suffix } = Path.split(path);
    const paths = Object.keys(api);
    const originalMethod = useRef();

    useEffect(() => {
      originalMethod.current = method;
      if (!method) {
        handleSetMethod();
        handleSaveButtonStatus(true);
        setAlertMethod(true);
      } else {
        handleSetMethod();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSetMethod = () => {
      handleSaveButtonStatus(false);
      setAlertMethod(false);
    };

    const usedMethods = api[path]
      ? Object.keys(api[path]).filter(
          (item) => item !== method && item !== originalMethod.current
        )
      : [];

    const handleCheck = (value) => {
      pathRef.current = prefix + "/" + value;

      const pathStatus = Path.isUsed(paths, prefix, suffix, value);
      handleSaveButtonStatus(pathStatus);
      setAlertPath(pathStatus);
    };

    return (
      <Grid container sx={styles.root}>
        <Grid sx={styles.firstElement} />
        <Grid item>
          <Grid container item sx={styles.content}>
            <FormControl variant={"outlined"} size={"small"}>
              <Select
                error={alertMethod}
                defaultValue={method ? method : ""}
                onChange={(e) => {
                  handleChangeMethod(e.target.value);
                  handleSetMethod();
                }}
              >
                {Constants.methods
                  .filter((methodName) => !usedMethods.includes(methodName))
                  .map((item, index) => {
                    return (
                      <MenuItem value={item} key={index}>
                        {item}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <Box component={"span"} sx={styles.text}>
              {prefix}
              {Path.addSlashMark(prefix)}
            </Box>
            <TextField
              defaultValue={suffix}
              onChange={(e) => handleCheck(e.target.value)}
              sx={styles.textField}
              error={alertPath}
            />
          </Grid>
        </Grid>
        <Button
          variant={view === "TYPES" ? "contained" : "outlined"}
          onClick={() => setApiDialogView("TYPES")}
        >
          <LanguageIcon sx={styles.icon} />
          Types
        </Button>
      </Grid>
    );
  }
);

export default APIPath;
