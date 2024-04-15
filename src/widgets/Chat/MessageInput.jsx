import CodeIcon from "@mui/icons-material/Code";
import SendIcon from "@mui/icons-material/Send";
import useChat from "./useChat";
import useConfirmDialog from "../../components/ConfirmDialog";

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
  const { loading, handleSendMessage, showConvertToProject } = props;
  const theme = useTheme();
  const [, , convertChat] = useChat();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isInputEmpty, setIsInputEmpty] = useState(true);
  const [ConfirmDialog, showConfirmDialog] = useConfirmDialog();
  const inputRef = useRef(null);

  useEffect(() => {
    if (showConvertToProject) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showConvertToProject]);

  useImperativeHandle(ref, () => ({
    getValue: () => inputRef.current.value,
    clear: () => {
      inputRef.current.value = "";
      setIsInputEmpty(true);
    },
    setValue: (value) => {
      inputRef.current.value = value;
      setIsInputEmpty(false);
    },
  }));

  const handleProjectIconClick = () => {
    showConfirmDialog(
      "Convert to Project",
      "Are you sure you want to convert this chat to a project?",
      () => {
        convertChat();
      }
    );
  };

  const onSend = async (event) => {
    event.preventDefault();
    await handleSendMessage();
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
          data-cy="message-input"
        />
        {showConvertToProject && (
          <Tooltip
            title={
              <Typography sx={{ fontSize: "1rem" }}>
                Convert to Project
              </Typography>
            }
            placement="top"
          >
            <IconButton
              type="button"
              onClick={handleProjectIconClick}
              className={isAnimating ? "pulse-animation" : ""}
              sx={{ ml: 1 }}
              data-cy="convert-to-project-button"
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>
        )}
        <IconButton
          type="submit"
          disabled={loading || isInputEmpty}
          sx={{ color: theme.palette.grey[500], ml: 1 }}
          data-cy="send-button"
        >
          <SendIcon />
        </IconButton>
      </Box>
      <ConfirmDialog />
    </Box>
  );
});

export default MessageInput;
