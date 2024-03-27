import MuiAlert from "@mui/material/Alert";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Stack } from "@mui/material";

import { publish, useEvent } from "@nucleoidai/react-event";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function GlobalSnackMessage() {
  const [globalMessage] = useEvent("GLOBAL_MESSAGE", {
    status: false,
    message: "",
    severity: "success",
  });

  const handleClose = () => {
    publish("GLOBAL_MESSAGE", {
      status: false,
    });
  };

  if (globalMessage.status) {
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
          open={true}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={globalMessage.severity}
            sx={{ width: "100%" }}
          >
            {globalMessage.message}
          </Alert>
        </Snackbar>
      </Stack>
    );
  } else {
    return null;
  }
}
