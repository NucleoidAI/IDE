import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { Resizable } from "re-resizable";
import { IconButton, TextField } from "@mui/material";

const sub = { item: null };
const response = (res) => {
  sub.item = res;
};
export const handleAddResponseMessage = (ret) => {
  sub.item(ret);
};

const ChatWindow = ({
  open,
  handleClose,
  handleNewUserMessage,
  history = [{ message: "welcome to nucleoid chat" }],
}) => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([...history]);

  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    response((ret) => {
      setMessages([...messages, { message: ret, user: false }]);
    });
  }, [messages]);

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const newUserMessage = () => {
    handleNewUserMessage(message);
    setMessages([...messages, { message: message, user: true }]);
    setMessage("");
  };

  if (open) {
    return (
      <Resizable
        defaultSize={{
          width: 500,
          height: 600,
          minWidth: 320,
          minHeight: 200,
        }}
        style={{
          position: "absolute",
          zIndex: 999999,
          backgroundColor: "white",
          bottom: 10,
          right: 10,
          border: "solid 1px #ddd",
          margin: 0,
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              width: "100%",
              height: 60,
              color: "#e0e0e0",
              bgcolor: "#323a40",
            }}
          >
            Nuc Chat
            <IconButton onClick={handleClose}>
              <CloseIcon htmlColor="#e0e0e0" />
            </IconButton>
          </Box>
          <Box
            sx={{
              height: "100%",
              width: "100%",
              p: 1,
              overflowY: "scroll",
              userSelect: "text",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((item) => (
              <div
                ref={messagesEndRef}
                style={{
                  backgroundColor: item.user ? "#e6eff6" : "#f4f7f9",
                  margin: 5,
                  borderRadius: 5,
                  width: "fit-content",
                  alignSelf: item.user ? "end" : "start",
                }}
              >
                <div style={{ padding: 12 }}>{item.message}</div>
              </div>
            ))}
          </Box>
          <Box sx={{ height: 60, width: "100%", p: 1 }}>
            <TextField
              autoComplete="off"
              autoFocus
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  newUserMessage();
                }
              }}
              placeholder={"Type a message..."}
              size="small"
              sx={{ width: "100%" }}
            />
          </Box>
        </Box>
      </Resizable>
    );
  } else {
    return null;
  }
};

export default ChatWindow;
