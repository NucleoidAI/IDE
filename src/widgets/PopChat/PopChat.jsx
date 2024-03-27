import React from "react";
import Settings from "../../settings";
import service from "../../service";
import { useContext } from "../../context/context";
import { useEvent } from "@nucleoidai/react-event";

import { ChatWindow, handleAddResponseMessage } from "@nucleoidjs/components";

const PopChat = () => {
  const [open, setOpen] = useEvent("CHAT_WINDOW", false);
  const [openChat, setOpenChat] = React.useState(false);
  const [, dispatch] = useContext();

  React.useEffect(() => {
    if (open) {
      if (Settings.token()) {
        setOpenChat(true);
      } else {
        service.getProjects().finally(() => {
          setOpenChat(false);
          setOpen("CHAT_WINDOW", false);
        });
      }
    } else {
      setOpenChat(false);
    }
  }, [open, setOpen]);

  const handleNewUserMessage = (message) => {
    const parts = message.split('"');

    if (parts.length === 1) {
      setTimeout(() => {
        handleAddResponseMessage("Not able to understand your message");
      }, 500);

      return;
    }

    const resource = parts[1];

    setTimeout(() => {
      dispatch({ type: "CREATE_SAMPLE_CRUD", payload: { resource } });
      handleAddResponseMessage(`"${resource}" resource is created.`);
    }, 1000);
  };

  const handleClose = () => {
    setOpen("CHAT_WINDOW", false);
  };

  return (
    <ChatWindow
      title={"Nucbot-Powered by OpenAI"}
      open={openChat}
      handleClose={handleClose}
      history={[{ message: "Welcome to NucBot! 🤖", user: false }]}
      handleNewUserMessage={handleNewUserMessage}
    />
  );
};

export default PopChat;
