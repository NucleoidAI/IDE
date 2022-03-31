import Err from "../../icons/pngs/close.png";
import Ok from "../../icons/pngs/check.png";
import Warn from "../../icons/pngs/warning.png";
import styles from "./styles";
import { useApiStatusStore } from "../../Context/providers/ApiStatusStoreProvider";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2"; // eslint-disable-line

const data = {
  labels: ["Used", "Free"],
  datasets: [
    {
      backgroundColor: ["rgba(64, 188, 216, 0.5)", "rgba(22, 219, 147, 0.5)"],
      data: [66, 88],
      borderWidth: 0,
    },
  ],
};

const options = {
  legend: {
    position: false,
  },
};

function Status() {
  const [state, dispatch] = useApiStatusStore();

  return (
    <Grid
      container
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={styles.root}
    >
      <Grid />
      {state.name}
      <Grid sx={styles.chart}>
        <Doughnut data={data} options={options} />
      </Grid>
      <StatusText warn />
      <Button onClick={() => dispatch({ type: "SELAM" })}>sa</Button>
    </Grid>
  );
}

const StatusText = ({ ok, warn, err }) => {
  return (
    <Grid container justifyContent={"center"} alignItems={"center"}>
      <Grid>
        <Avatar
          sx={{ width: 15, height: 15 }}
          src={ok ? Ok : warn ? Warn : Err}
        />
      </Grid>
      <Grid>&nbsp;</Grid>
      <Grid>
        <Typography sx={styles.statusText}>connected</Typography>
      </Grid>
    </Grid>
  );
};

export default Status;
