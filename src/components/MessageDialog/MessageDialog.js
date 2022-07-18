import AlertTitle from "@mui/material/AlertTitle";
import MuiAlert from "@mui/material/Alert";
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import StarUsOnGithub from "../StarUsOnGithub";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const MessageDialog = ({ message, handleCloseMessage }) => {
  const { vertical, horizontal, open, msg } = message;

  return (
    <Snackbar
      open={open}
      onClose={handleCloseMessage}
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={msg === "success" ? 6000 : 10000}
      key={vertical + horizontal}
    >
      <Alert
        onClose={handleCloseMessage}
        variant="filled"
        severity={msg === "success" ? "success" : "info"}
        sx={{ width: "100%" }}
      >
        {msg === "success" && (
          <>
            <AlertTitle>Congrats!</AlertTitle>
            You've created your APIs with the help of AI
          </>
        )}
        {msg !== "success" && (
          <>
            <AlertTitle>Congratulations!</AlertTitle>
            <StarUsOnGithub />
          </>
        )}
      </Alert>
    </Snackbar>
  );
};

export default MessageDialog;
