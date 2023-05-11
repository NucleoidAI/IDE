import LockIcon from "@mui/icons-material/Lock";
import styles from "./styles";
import { Button, Grid } from "@mui/material";

function Security({ onClick }) {
  return (
    <Grid container sx={styles.root}>
      <Button
        onClick={() => onClick()}
        sx={styles.button}
        variant={"text"}
        fullWidth
      >
        <LockIcon />
        &nbsp; Express.js
      </Button>
    </Grid>
  );
}

export default Security;
