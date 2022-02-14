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
import {
  checkLastCharSlashMark,
  checkPathUsed,
  splitPathPrefixAndSuffix,
} from "../../utils/Path";
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
    { pathName, api }
  ) => {
    const [alert, setAlert] = useState();
    const prefix = splitPathPrefixAndSuffix(path)[0];
    const suffix = splitPathPrefixAndSuffix(path)[1];

    const pathNames = Object.keys(api.current);

    const originalMethodName = useRef();

    useEffect(() => {
      originalMethodName.current = method;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const methodNames = api.current[path]
      ? Object.keys(api.current[path]).filter((item) => {
          if (item !== method && item !== originalMethodName.current) {
            return item;
          } else return null;
        })
      : [];

    const handleCheck = (value) => {
      pathName.current = prefix + "/" + value;

      const pathStatus = checkPathUsed(pathNames, prefix, suffix, value);
      handleSaveButtonStatus(pathStatus);
      setAlert(pathStatus);
    };

    return (
      <Grid container sx={styles.root}>
        <Grid sx={styles.firstElement} />
        <Grid item>
          <Grid container item sx={styles.content}>
            <FormControl variant={"outlined"} size={"small"}>
              <Select
                defaultValue={method}
                onChange={(e) => handleChangeMethod(e.target.value)}
              >
                {Object.keys(methods).map((item, index) => {
                  if (!methodNames?.find((metodname) => metodname === item)) {
                    return (
                      <MenuItem value={item} key={index}>
                        {methods[item]}
                      </MenuItem>
                    );
                  } else return null;
                })}
              </Select>
            </FormControl>
            <Box component={"span"} sx={styles.text}>
              {prefix}
              {checkLastCharSlashMark(prefix) ? "" : "/"}
            </Box>
            <TextField
              defaultValue={suffix}
              onChange={(e) => handleCheck(e.target.value)}
              sx={styles.textfield}
              error={alert}
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
