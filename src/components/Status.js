import { Doughnut } from "react-chartjs-2";
import { Box, Grid } from "@material-ui/core";

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
  animation: {
    duration: 0,
  },
};

function Status() {
  return (
    <Grid container justifyContent={"center"}>
      <Box width={150} height={150}>
        <Doughnut data={data} options={options} />
      </Box>
    </Grid>
  );
}

export default Status;
