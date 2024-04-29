import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { Stack } from "@mui/material";
import { useEvent } from "@nucleoidai/react-event";

import React, { useEffect, useState } from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function GlobalSnackMessage() {
  const [appMessage] = useEvent("APP_MESSAGE", null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (appMessage) {
      setOpen(true);
      timeoutId = setTimeout(() => {
        setOpen(false);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [appMessage]);

  return (
    <Stack
      sx={{
        width: "500px",
        height: "500px",
        position: "relative",
      }}
    >
      <Snackbar
        sx={{
          zIndex: 99999,
        }}
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          data-cy="global-snack-message"
          severity={appMessage?.severity}
          sx={{ width: "100%" }}
        >
          {appMessage?.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
