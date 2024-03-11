import ChatEditor from "./ChatEditor";
import EditIcon from "@mui/icons-material/Edit";
import ReadOnlyEditor from "../../components/ReadOnlyEditor";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useEvent } from "@nucleoidjs/react-event";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const ErroMessage = ({ show, content, type }) => {
  console.log(show);
  return (
    show && (
      <Box
        sx={{
          backgroundColor: alpha("#f44336", 0.1),
          border: "1px solid #f44336",
          width: "60%",
          marginBottom: "20px",
          padding: "10px",
          borderRadius: "10px",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          userSelect: "text",
        }}
      >
        <Stack
          direction={"row"}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "space-between",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              userSelect: "text",
            }}
          >
            EXPERT ERROR
          </Typography>
          <Box
            component={RefreshIcon}
            sx={{
              "&:hover": {
                color: "gray",
                cursor: "pointer",
              },
            }}
          />
        </Stack>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: "bold",
            my: "8px",
            userSelect: "text",
          }}
        >
          {type}
        </Typography>
        <Typography variant="body1" sx={{ userSelect: "text" }}>
          {content}
        </Typography>
      </Box>
    )
  );
};

const ChatDisplay = ({ chat, loading, setLoading }) => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  const messagesContainerRef = useRef(null);
  const [error] = useEvent("EXPERT_ERROR_OCCURRED", {
    status: false,
    type: "",
    content: "",
  });

  useEffect(() => {
    if (error.status) {
      setLoading(false);
    }
  }, [error.status]);

  const handleOpenDialog = (code) => {
    setSelectedCode(code);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      const atBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 1;

      const scrollToBottomButton = document.getElementById(
        "scrollToBottomButton"
      );
      if (scrollToBottomButton) {
        scrollToBottomButton.style.display = atBottom ? "none" : "block";
      }
    }
  };

  useEffect(() => {
    setTimeout(scrollToBottom, 10);
  }, [chat]);

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
      }}
      ref={messagesContainerRef}
      onScroll={handleScroll}
    >
      {chat &&
        chat.messages.map((message, index) => (
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
              {message.role}
            </Typography>
            <Typography variant="body1" sx={{ userSelect: "text" }}>
              {message.content}
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
                  padding: "0",
                  userSelect: "text",
                  width: "100%",
                }}
              >
                <ReadOnlyEditor
                  value={message.code}
                  language="typescript"
                  actionIcon={EditIcon}
                  onActionClick={() => handleOpenDialog(message.code)}
                />
              </Box>
            )}
          </Box>
        ))}
      <ErroMessage
        show={error.status}
        content={error.content}
        type={error.type}
      />
      <Button
        onClick={scrollToBottom}
        sx={{ position: "fixed", bottom: 20, right: 20 }}
        id="scrollToBottomButton"
        style={{ display: "none" }}
      >
        Scroll to Bottom
      </Button>
      {loading && <CircularProgress />}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth={true}
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "30vh",
            maxHeight: "60vh",
            width: "60%",
          },
        }}
      >
        <DialogTitle>Code Analysis</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%" }}>
            <ChatEditor code={selectedCode} readOnly={true} />
          </Box>
        </DialogContent>
        <Button onClick={handleCloseDialog}>Close</Button>
      </Dialog>
    </Box>
  );
};
export default ChatDisplay;
