import LinearProgress from "@mui/material/LinearProgress";
import QueryArrayTable from "../../components/QueryArrayTable";
import QueryResult from "../../components/QueryResult";
import RatioIconButtons from "../../components/RatioIconButtons/RatioIconButtons";
import styles from "./styles";

import {
  Box,
  Card,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

function QueryResultWidget({
  result,
  loading,
  handleSetOutputRatio,
  outputRatio,
}) {
  const [checked, setChecked] = useState(true);

  return loading ? (
    <Card sx={styles.loadingCard}>
      <LinearProgress color="inherit" />
    </Card>
  ) : (
    <Card sx={styles.contentCard}>
      <RatioIconButtons
        handleSetOutputRatio={handleSetOutputRatio}
        outputRatio={outputRatio}
      />
      <Box sx={styles.jsonSwitch}>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch checked={checked} onChange={() => setChecked(!checked)} />
            }
            label={"JSON"}
          />
        </FormGroup>
        {result && <Typography variant="h7">time :{result.time} ms</Typography>}
      </Box>
      {ResultTypes(result, checked)}
      {!result && (
        <Box sx={styles.consoleOutput}>
          <Typography variant="h7">Console output</Typography>
        </Box>
      )}
    </Card>
  );
}

const ResultTypes = (result, isTable) => {
  if (typeof result === "object") {
    switch (typeof result.result) {
      case "object":
        if (Array.isArray(result.result)) {
          if (isTable) {
            return <QueryResult json={result.result} />;
          } else {
            return <QueryArrayTable json={result.result} />;
          }
        } else {
          return <QueryResult json={result.result} />;
        }
      default:
        return result.result;
    }
  } else {
    return <>{result}</>;
  }
};

export default QueryResultWidget;
