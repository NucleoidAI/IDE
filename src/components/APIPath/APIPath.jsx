import Constants from "../../constants";
import LanguageIcon from "@mui/icons-material/Language";

import styles from "./styles";
import { Box, Button, Grid, MenuItem, Select, TextField } from "@mui/material";

const APIPath = () => {
  return (
    <Grid container sx={styles.root}>
      <Grid sx={styles.firstElement} />
      <Grid item>
        <Grid container item sx={styles.content}>
          <Select defaultValue={""}>
            {Constants.methods
              .filter((methodName) => methodName)
              .map((item, index) => {
                return (
                  <MenuItem value={item} key={index}>
                    {item.toUpperCase()}
                  </MenuItem>
                );
              })}
          </Select>
          <Box component={"span"} sx={styles.text}>
            /
          </Box>
          <TextField />
        </Grid>
      </Grid>
      <Button>
        <LanguageIcon sx={styles.icon} />
        Types
      </Button>
    </Grid>
  );
};

export default APIPath;
