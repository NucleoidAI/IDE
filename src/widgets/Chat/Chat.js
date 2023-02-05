import React from "react";
import Settings from "../../settings";
import { deepCopy } from "../../utils/DeepCopy";
import service from "../../service";
import { useContext } from "../../context/context";
import { useEvent } from "@nucleoidjs/synapses";

import ChatWindow, {
  handleAddResponseMessage,
} from "../../components/ChatWindow";

const Chat = () => {
  const [open, setOpen] = useEvent("chatWindow", false);
  const [openChat, setOpenChat] = React.useState(false);
  const [context] = useContext();

  React.useEffect(() => {
    if (open) {
      if (Settings.token()) {
        setOpenChat(true);
      } else {
        service.getProjects().finally(() => {
          setOpenChat(false);
          setOpen("chatWindow", false);
        });
      }
    } else {
      setOpenChat(false);
    }
  }, [open, setOpen]);

  const generateContent = () => {
    const nucFunctions = deepCopy(context.nucleoid.functions);

    return nucFunctions.map((item) => item.definition).join("\n");
  };

  const handleNewUserMessage = (message) => {
    service
      .openai(generateContent(), message)
      .then((res) => handleAddResponseMessage(res.data.text));
  };

  const handleClose = () => {
    setOpen("chatWindow", false);
  };

  return (
    <ChatWindow
      open={openChat}
      handleClose={handleClose}
      history={[{ message: "Welcome to nucleoid chat", user: false }]}
      handleNewUserMessage={handleNewUserMessage}
    />
  );
};

export default Chat;
