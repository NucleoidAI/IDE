import LinearProgress from "@mui/material/LinearProgress";
import QueryArrayTable from "../../components/QueryArrayTable";
import QueryResult from "../../components/QueryResult";
import RatioIconButtons from "../../components/RatioIconButtons/RatioIconButtons";
import styles from "./styles";
import DoneIcon from "@mui/icons-material/Done";

import {
  Box,
  Card,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

function QueryResultWidget({
  result,
  loading,
  handleSetOutputRatio,
  outputRatio,
}) {
  const [checked, setChecked] = useState(true);
  const theme = useTheme();
  const isDisabled = !result || typeof result.result !== "object";

  return loading ? (
    <Card sx={styles.loadingCard}>
      <LinearProgress />
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
              <Switch
                checked={checked}
                onChange={() => setChecked(!checked)}
                disabled={isDisabled}
              />
            }
            label={
              <Typography
                variant="body1"
                style={{
                  color: isDisabled
                    ? theme.palette.grey[700]
                    : theme.palette.text.primary,
                }}
              >
                JSON
              </Typography>
            }
          />
        </FormGroup>
        {result && !checked ? (
          <Typography variant="h7">{result.time} ms</Typography>
        ) : null}
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
  const theme = useTheme();

  if (result) {
    const timeComponent = (
      <Typography variant="h7">{result.time} ms</Typography>
    );

    if (typeof result.result === "object") {
      if (Array.isArray(result.result)) {
        return isTable ? (
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={1}>
              <DoneIcon sx={{ color: theme.palette.success.dark }} />
              {timeComponent}
            </Box>
            <QueryResult json={result.result} />
          </Box>
        ) : (
          <QueryArrayTable json={result.result} />
        );
      } else {
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <QueryResult json={result.result} />
            {timeComponent}
          </Box>
        );
      }
    } else {
      if (result.result === null || result.result === undefined) {
        return (
          <Box display="flex" alignItems="center" gap={2}>
            <DoneIcon sx={{ color: theme.palette.success.dark }} />
            {timeComponent}
          </Box>
        );
      } else {
        const value = { value: result.result };
        return (
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={2}>
              <DoneIcon sx={{ color: theme.palette.success.dark }} />
              {timeComponent}
            </Box>
            <QueryResult json={value} />
          </Box>
        );
      }
    }
  } else {
    return <p>{result}</p>;
  }
};

export default QueryResultWidget;
