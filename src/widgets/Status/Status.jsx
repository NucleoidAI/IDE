import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Settings from "../../settings";
import styles from "./styles";
import { Doughnut } from "react-chartjs-2/"; // eslint-disable-line
import { Box, Grid, Tooltip, Typography } from "@mui/material";
import "chart.js/auto"; // eslint-disable-line
import { useEvent } from "@nucleoidai/react-event";

function Status() {
  const [state] = useEvent("RUNTIME_CONNECTION", {
    status: false,
    metrics: { free: 50, total: 100 },
  });

  const options = {
    legend: {
      position: true,
    },
    /* animation: {
      duration: state.metrics.animation,
    },*/
  };

  const data = {
    labels: ["Used", "Free"],
    datasets: [
      {
        backgroundColor: ["rgba(64, 188, 216, 0.5)", "rgba(22, 219, 147, 0.5)"],
        data: [state.metrics.total - state.metrics.free, state.metrics.free],
        borderWidth: 0,
      },
    ],
  };

  return (
    <Grid
      container
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={styles.root}
    >
      {!Settings.plugin() && (
        <Grid sx={styles.chart}>
          <Doughnut data={data} options={options} />
          <Grid
            container
            justifyContent={"center"}
            alignItems={"center"}
            sx={{ pt: 1 }}
          >
            <StatusContent state={state} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}

const StatusContent = ({ state }) => {
  const { status } = state;

  switch (status) {
    case true:
      return (
        <>
          <CheckCircleOutlineIcon sx={styles.icon} /> &nbsp;
          <Typography sx={styles.statusText}>Connected</Typography>
        </>
      );

    case false:
      return (
        <Tooltip
          title={
            "The nucleoid runtime is not started. Run the `npx nucleoidjs start` in terminal."
          }
          placement="top-start"
        >
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <ErrorOutlineIcon sx={styles.icon} />
            &nbsp;
            <Typography sx={styles.statusText}>Not Connected</Typography>
          </Box>
        </Tooltip>
      );

    default:
      return null;
  }
};

export default Status;
