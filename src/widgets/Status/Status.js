import Err from "../../icons/pngs/close.png";
import Loading from "../../icons/pngs/loading.png";
import Ok from "../../icons/pngs/check.png";
import Warn from "../../icons/pngs/warning.png";
import styles from "./styles";
import { useApiStatusStore } from "../../Context/providers/ApiStatusStoreProvider";
import { Avatar, Grid, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2"; // eslint-disable-line

function Status() {
  const [state] = useApiStatusStore();
  const metrics = state.metrics;

  const options = {
    legend: {
      position: true,
    },
    animation: {
      duration: metrics.animation,
    },
  };

  const data = {
    labels: ["Used", "Free"],
    datasets: [
      {
        backgroundColor: ["rgba(64, 188, 216, 0.5)", "rgba(22, 219, 147, 0.5)"],
        data: [metrics.total - metrics.free, metrics.free],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Grid
      container
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={styles.root}
    >
      <Grid />
      <Grid sx={styles.chart}>
        <Doughnut data={data} options={options} />
      </Grid>
      <StatusText warn state={state} />
    </Grid>
  );
}

const StatusText = ({ ok, warn, err, state }) => {
  return (
    <Grid container justifyContent={"center"} alignItems={"center"}>
      <Grid>
        <Avatar sx={{ width: 15, height: 15 }} src={StatusContent(state.status)} />
      </Grid>
      <Grid>&nbsp;</Grid>
      <Grid>
        <Typography sx={styles.statusText}>
          {StatusContent(state.status, true)}
        </Typography>
      </Grid>
    </Grid>
  );
};

const StatusContent = (status, isText) => {
  switch (status) {
    case "connected":
      return isText ? "Connected" : Ok;
    case "connecting":
      return isText ? "Connecting" : Loading;
    case "disconnected":
      return isText ? "Disconnected" : Warn;
    case "unreachable":
      return isText ? "Unreachable" : Err;
    default:
  }
};

export default Status;
