import LockIcon from "@mui/icons-material/Lock";
import { Button, Grid } from "@mui/material";

function Security({ onClick }) {
  return (
    <Grid container justifyContent={"center"}>
      <Button
        onClick={() => onClick()}
        style={{ textTransform: "none" }}
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
