import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LoopIcon from "@mui/icons-material/Loop";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import styles from "./styles";
import { useLayoutContext } from "../../Context/providers/layoutContextProvider";
import { Button, Grid, Tooltip, Typography } from "@mui/material";
import { Doughnut } from "react-chartjs-2"; // eslint-disable-line
import OpenSandbox from "../../components/OpenSandbox";

function Status() {
  const [state, dispatch] = useLayoutContext();
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

        <Grid
          container
          justifyContent={"center"}
          alignItems={"center"}
          sx={{ pt: 1 }}
        >
          <Grid>{StatusContent(state)}</Grid>&nbsp;
          <Grid>{StatusContent(state, true)}</Grid>
        </Grid>
      </Grid>
      <StatusText warn state={state} dispatch={dispatch} />
    </Grid>
  );
}

const StatusText = ({ state, dispatch }) => {
  return (
    <Grid sx={{ width: "100%", pt: 4 }}>
      <Button
        disabled={!state.sandbox}
        onClick={() =>
          dispatch({ type: "SANDBOX", payload: { dialogStatus: true } })
        }
        size={"large"}
        sx={{ width: "100%", color: "#A5A7AB", textTransform: "none" }}
      >
        <OpenSandbox create fill={!state.sandbox ? "#2d302f" : "#c3c5c8"} />
      </Button>
    </Grid>
  );
};

const StatusContent = (state, isText) => {
  const { status, openapi } = state;
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
          title={!openapi ? "The nucleoid runtime is not started. Run the `npx nucleoidjs start` in terminal." : 
        "Codesandbox is hibernated. Click re-run button or Open sandbox."}
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
