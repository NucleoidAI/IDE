import SendIcon from "@mui/icons-material/Send";
import codeImage from "../../images/code.png";

import {
  Box,
  Fab,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const MessageInput = forwardRef((props, ref) => {
  const { handleSendMessage } = props;
  const theme = useTheme();
  const [showProjectIcon, setShowProjectIcon] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(true);

  const inputRef = useRef(null);

  const handleHover = () => {
    setPlayAnimation(false);
  };

  useImperativeHandle(ref, () => ({
    getValue: () => inputRef.current.value,
    clear: () => {
      inputRef.current.value = "";
    },
  }));

  const handleProjectIconClick = () => {
    console.log("Project icon clicked");
  };

  const onSend = (event) => {
    event.preventDefault();
    const message = inputRef.current.value;
    if (message.trim()) {
      handleSendMessage(message);
      inputRef.current.value = "";
      setShowProjectIcon(!showProjectIcon);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={onSend}
      sx={{
        display: "flex",
        justifyContent: "center",
        padding: "10px",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "70%",
          borderRadius: "20px",
          padding: "10px",
          border: `1px solid `,
          borderColor: theme.palette.grey[500],
          backgroundColor: theme.palette.background.default,
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          placeholder="Type your message here..."
          InputProps={{
            disableUnderline: true,
          }}
          inputRef={inputRef}
          multiline
          maxRows={4}
          sx={{ flexGrow: 1 }}
        />
        {showProjectIcon && (
          <Tooltip
            title={
              <Typography sx={{ fontSize: "1rem" }}>
                Convert to Project
              </Typography>
            }
            placement="top"
          >
            <Fab
              color="primary"
              size="small"
              onClick={handleProjectIconClick}
              onMouseEnter={handleHover}
              sx={{
                backgroundColor: theme.palette.grey[600],

                animation: playAnimation
                  ? "pulseAnimationWithColor 2s infinite"
                  : "none",
              }}
            >
              <img src={codeImage} alt={"Code"} style={{ width: "100%" }} />
            </Fab>
          </Tooltip>
        )}
        <IconButton
          type="submit"
          sx={{ color: theme.palette.grey[500], ml: 1 }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
});
export default MessageInput;
