import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LoopIcon from "@mui/icons-material/Loop";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import styles from "./styles";
import { useApiStatusStore } from "../../Context/providers/ApiStatusStoreProvider";
import { Grid, Tooltip, Typography } from "@mui/material";
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
      <Grid justifyContent={"center"}>{StatusContent(state.status)}</Grid>
      <Grid>&nbsp;</Grid>
      <Grid>{StatusContent(state.status, true)}</Grid>
    </Grid>
  );
};

const StatusContent = (status, isText) => {
  switch (status) {
    case "connected":
      return isText ? (
        <Typography sx={styles.statusText}>Connected</Typography>
      ) : (
        <CheckCircleOutlineIcon sx={styles.icon} />
      );
    case "connecting":
      return isText ? (
        <Typography sx={styles.statusText}>Connecting</Typography>
      ) : (
        <LoopIcon sx={styles.icon} />
      );
    case "disconnected":
      return isText ? (
        <Typography sx={styles.statusText}>Disconnecting</Typography>
      ) : (
        <WarningAmberIcon sx={styles.icon} />
      );
    case "unreachable":
      return isText ? (
        <Tooltip
          title="The nucleoid runtime is not started. Run the `npx nucleoidjs start` in
        terminal."
          placement="top-start"
        >
          <Typography sx={styles.statusText}>Unreachable</Typography>
        </Tooltip>
      ) : (
        <ErrorOutlineIcon sx={styles.icon} />
      );

    default:
  }
};

export default Status;
