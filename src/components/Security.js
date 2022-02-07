import LockIcon from "@material-ui/icons/Lock";
import { Button, Grid } from "@material-ui/core";

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
