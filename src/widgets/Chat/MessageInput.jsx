import CodeIcon from "@mui/icons-material/Code";
import SendIcon from "@mui/icons-material/Send";

import {
  Box,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const MessageInput = forwardRef((props, ref) => {
  const { handleSendMessage } = props;
  const { loading } = props;
  const theme = useTheme();
  const [showProjectIcon, setShowProjectIcon] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (showProjectIcon) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showProjectIcon]);

  useImperativeHandle(ref, () => ({
    getValue: () => inputRef.current.value,
    clear: () => {
      inputRef.current.value = "";
      setIsInputEmpty(true);
      setShowProjectIcon(!showProjectIcon);
    },
    setValue: (value) => {
      inputRef.current.value = value;
      setIsInputEmpty(false);
    },
  }));

  const handleProjectIconClick = () => {
    console.log("Project icon clicked");
  };

  const onSend = (event) => {
    event.preventDefault();
    handleSendMessage();
  };

  const handleInputChange = (event) => {
    setIsInputEmpty(!event.target.value.trim());
  };

  return (
    <Box
      component="form"
      onSubmit={(event) => onSend(event)}
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
          width: { xs: "100%", sm: "90%", md: "80%" },
          borderRadius: theme.custom.chat.inputBorderRadius,
          padding: "10px",
          border: `1px solid`,
          borderColor: theme.palette.grey[500],
          backgroundColor: theme.palette.background.default,
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          onChange={handleInputChange}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              onSend(event);
            }
          }}
          disabled={loading}
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
            <IconButton
              type="submit"
              onClick={handleProjectIconClick}
              className={isAnimating ? "pulse-animation" : ""}
              sx={{ ml: 1 }}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>
        )}
        <IconButton
          type="submit"
          disabled={loading || isInputEmpty}
          sx={{ color: theme.palette.grey[500], ml: 1 }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
});

export default MessageInput;
