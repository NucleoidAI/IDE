import { Doughnut } from "react-chartjs-2";
import styles from "./styles";
import { Grid, Typography } from "@mui/material";

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
      <StatusText />
    </Grid>
  );
}

const StatusText = () => {
  return (
    <Grid>
      <Typography sx={styles.statusText}>status</Typography>
    </Grid>
  );
};

export default Status;
