import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Tooltip,
  Fab,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ProjectIcon from "@mui/icons-material/Construction";
import codeImage from "../../images/code.png";

import { useEvent } from "@nucleoidjs/react-event";
import useChat from "./useChat";
import Prism from "prismjs";
import "prismjs/themes/prism-twilight.css";
import "prismjs/components/prism-typescript";
import "./ChatMainArea.css";
import { CircularProgress } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";

const ChatDisplay = ({ chat }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Prism.highlightAll();
  }, [isLoading, openDialog, selectedCode]);

  const handleOpenDialog = (code) => {
    setSelectedCode(code);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box
      sx={{
        overflow: "auto",
        flex: 1,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        userSelect: "text",
      }}
    >
      {isLoading ? (
        <CircularProgress />
      ) : (
        chat?.messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              width: "60%",
              marginBottom: "20px",
              padding: "10px",
              borderRadius: "10px",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              userSelect: "text",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "bold",
                marginBottom: "8px",
                userSelect: "text",
              }}
            >
              {message.sender.toUpperCase()}
            </Typography>
            <Typography variant="body1" sx={{ userSelect: "text" }}>
              {message.text}
            </Typography>
            {message.code && (
              <Box
                component="pre"
                sx={{
                  overflowX: "auto",
                  justifyContent: "center",
                  marginTop: "8px",
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: "5px",
                  padding: "10px",
                  userSelect: "text",
                  width: "100%",
                }}
                onClick={() => handleOpenDialog(message.code)}
              >
                <Box component="code" className="language-typescript">
                  {message.code}
                </Box>
              </Box>
            )}
          </Box>
        ))
      )}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "60vh",
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle>Code Analysis</DialogTitle>
        <DialogContent dividers>
          <Box
            component="pre"
            sx={{
              overflowX: "auto",
              justifyContent: "center",
              marginTop: "8px",
              backgroundColor: theme.palette.grey[100],
              borderRadius: "5px",
              padding: "10px",
              userSelect: "text",
              width: "100%",
            }}
            onClick={() => Prism.highlightAll()}
          >
            <Box component="code" className="language-typescript">
              {selectedCode}
            </Box>
          </Box>
        </DialogContent>
        <Button onClick={handleCloseDialog}>Close</Button>
      </Dialog>
    </Box>
  );
};

const MessageInput = ({ inputValue, setInputValue, handleSendMessage }) => {
  const theme = useTheme();
  const [showProjectIcon, setShowProjectIcon] = useState(false);
  const [playAnimation, setPlayAnimation] = useState(true);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleProjectIconClick = () => {
    console.log("Project icon clicked");
  };

  const handleHover = () => {
    setPlayAnimation(false);
  };

  const onSend = (m) => {
    handleSendMessage(m);
    setShowProjectIcon(!showProjectIcon);
    setPlayAnimation(true);
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
          value={inputValue}
          onChange={handleInputChange}
          multiline
          maxRows={4}
          InputProps={{
            disableUnderline: true,
          }}
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
              <img src={codeImage} alt={"Code"} style={{ width: "100%" }} />{" "}
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
};

const suggestions = [
  "Define a new rule for user authentication",
  "Test the logic for the shopping cart discount",
  "Create a charter for managing state",
  "Brainstorm edge cases for the payment processing workflow",
];

const SuggestionsOverlay = ({ setInputValue }) => {
  const theme = useTheme();

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        position: "absolute",
        bottom: "10%",
        width: "100%",
        padding: "10px",
        zIndex: 1201,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          width: "70%",
          gap: "10px",
        }}
      >
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outlined"
            sx={{
              flexGrow: 1,
              minHeight: "60px",
              backgroundColor: theme.palette.background.default,
              borderColor: theme.palette.grey[500],
              "&:hover": {
                backgroundColor: theme.palette.grey[200],
                borderColor: theme.palette.primary.main,
              },
              textAlign: "left",
              justifyContent: "flex-start",
              borderRadius: "10px",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: "medium",
              width: "calc(50% - 30px)",
            }}
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

const ChatMainArea = () => {
  const theme = useTheme();
  const [chatId] = useEvent("CHAT_ID_CHANGED", 0);
  const [inputValue, setInputValue] = useState("");
  const chat = useChat(chatId);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (inputValue.trim()) {
      const newMessage = { sender: "human", text: inputValue };
      setInputValue("");
    }
  };
  const [showSuggestions, setShowSuggestions] = useState(true);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        paddingBottom: "10px",
      }}
    >
      <ChatDisplay chat={chat} />
      <SuggestionsOverlay setInputValue={setInputValue} />
      <MessageInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={handleSendMessage}
      />
    </Box>
  );
};

export default ChatMainArea;
