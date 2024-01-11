import LanguageIcon from "@mui/icons-material/Language";
import styles from "./styles";

import { Box, Button, Grid, Typography } from "@mui/material";

const APIPath = ({ method, path, onTypesButtonClick }) => {
  return (
    <Grid container sx={styles.root}>
      <Grid sx={styles.firstElement} />
      <Grid item>
        <Grid container item sx={styles.content}>
          <Typography>{method}</Typography>
          <Box component={"span"} sx={styles.text}>
            /
          </Box>
          <Typography>{path.replace("/", "")}</Typography>
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
