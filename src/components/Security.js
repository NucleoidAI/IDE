import LockIcon from "@material-ui/icons/Lock";
import { Button, Grid } from "@material-ui/core";

function Security() {
  return (
    <Grid container justifyContent={"center"}>
      <Button style={{ textTransform: "none" }} variant={"text"} fullWidth>
        <LockIcon />
        &nbsp; Express.js
      </Button>
    </Grid>
  );
}

export default Security;
