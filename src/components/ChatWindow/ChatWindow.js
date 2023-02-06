import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { Rnd } from "react-rnd";
import { Box, Fab, IconButton, TextField } from "@mui/material";

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
  history = [],
}) => {
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([...history]);
  const rndRef = React.useRef();
  const [defaultPosition, setDefaultPosition] = React.useState({
    x: 0,
    y: 0,
  });

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
  }, [messages, open]);

  React.useEffect(() => {
    const posX = window.innerWidth - 530;
    const posY = window.innerHeight - 660;
    setDefaultPosition({ x: posX, y: posY });
  }, [open]);

  const newUserMessage = () => {
    handleNewUserMessage(message);
    setMessages([...messages, { message: message, user: true }]);
    setMessage("");
  };

  if (open) {
    return (
      <Rnd
        ref={rndRef}
        position={{ x: defaultPosition.x, y: defaultPosition.y }}
        onDragStop={(e, d) => setDefaultPosition({ x: d.x, y: d.y })}
        default={{
          x: defaultPosition.x,
          y: defaultPosition.y,
          height: 650,
          width: 450,
        }}
        minHeight={650}
        minWidth={450}
        bounds={"window"}
        dragHandleClassName={"handle"}
        style={{
          zIndex: 999999999,
        }}
        resizeHandleStyles={{
          bottom: { bottom: 65 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {/* header */}
          <Box
            className="handle"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
              width: "100%",
              color: "#e0e0e0",
              bgcolor: "#323a40",
              cursor: "move",
            }}
          >
            <Box>
              NucBot&nbsp;-&nbsp;
              <small>Powered by OpenAI</small>
            </Box>
            <IconButton onClick={handleClose}>
              <CloseIcon htmlColor="#e0e0e0" />
            </IconButton>
          </Box>
          {/* content */}
          <Box
            sx={{
              height: "100%",
              width: "100%",
              p: 1,
              overflowY: "auto",
              float: "left",
              clear: "both",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
              border: "solid 0.5px #ddd",
              userSelect: "text",
            }}
          >
            {messages.map((item, index) => (
              <div
                key={index}
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
          {/*footer */}
          <Box
            sx={{
              width: "100%",
              p: 1,
              bgcolor: "white",
              border: "solid 0.5px #ddd",
            }}
          >
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
          {/*button */}
          <Box
            sx={{ width: "100%", p: 1, display: "flex", justifyContent: "end" }}
          >
            <Fab className="handle">
              <ChatIcon />
            </Fab>
          </Box>
        </Box>
      </Rnd>
    );
  } else {
    return null;
  }
};

export default ChatWindow;
