import ChatEditor from "./ChatEditor";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const ChatDisplay = ({ chat }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");

  useEffect(() => {
    //TODO: Replace with actual loading logic
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
                  padding: "0",
                  userSelect: "text",
                  width: "100%",
                }}
                onClick={() => handleOpenDialog(message.code)}
              >
                <ChatEditor code={message.code} readOnly={true} />
              </Box>
            )}
          </Box>
        ))
      )}
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
