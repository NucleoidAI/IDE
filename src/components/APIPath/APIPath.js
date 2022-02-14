import LanguageIcon from "@mui/icons-material/Language";
import methods from "../../utils/constants/methods";
import Constants from "../../constants";
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
import Path from "../../utils/Path";
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
    const [alert, setAlert] = useState();
    const { prefix, suffix } = Path.split(path);
    const paths = Object.keys(api);
    const originalMethodName = useRef(); // TODO Verify is being used

    useEffect(() => {
      originalMethodName.current = method;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const usedMethods = api[path]
      ? Object.keys(api[path]).filter(
          (item) => item !== method && item !== originalMethodName.current
        )
      : [];

    const handleCheck = (value) => {
      pathRef.current = prefix + "/" + value;

      const pathStatus = Path.isUsed(paths, prefix, suffix, value);
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
                  if (!usedMethods?.find((methodName) => methodName === item)) {
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
