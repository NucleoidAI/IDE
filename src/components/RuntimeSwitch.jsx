import CopyClipboard from "./CopyClipboard";
import DialogTooltip from "./DialogTootip";
import React from "react";
import Settings from "../settings";
import { Box, Switch, Typography } from "@mui/material";

function RuntimeSwitch() {
  const [sandbox, setSandbox] = React.useState(
    Settings.runtime() === "sandbox" ? true : false
  );
  const [alert, setAlert] = React.useState(false);

  function handleSwitch() {
    if (sandbox) {
      Settings.runtime("custom");
      setAlert(true);
    }
    if (!sandbox) {
      Settings.runtime("sandbox");
      setAlert(false);
    }

    setSandbox(!sandbox);
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <DialogTooltip
          open={alert}
          placement="bottom-start"
          title={<b>Runtime</b>}
          message={
            <>
              Run the following code in your terminal
              <br />
              <CopyClipboard />
              <br />
            </>
          }
          handleTooltipClose={() => setAlert(false)}
        >
          <Typography
            fontWeight={!sandbox ? "bold" : null}
            sx={{ pr: 1, fontSize: !sandbox ? "16px" : "15px" }}
          >
            Custom
          </Typography>
        </DialogTooltip>
      </Box>
      <Box
        sx={{
          width: "30%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Switch checked={sandbox} color="default" onChange={handleSwitch} />
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Typography
          fontWeight={sandbox ? "bold" : null}
          sx={{
            pl: 1,
            fontSize: sandbox ? "16px" : "15px",
            width: 108,
          }}
        >
          sandbox
        </Typography>
      </Box>
    </Box>
  );
}

export default RuntimeSwitch;
