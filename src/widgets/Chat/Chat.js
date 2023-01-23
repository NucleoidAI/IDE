import React from "react";
import { useEvent } from "@nucleoidjs/synapses";
import ChatWindow, {
  handleAddResponseMessage,
} from "../../components/ChatWindow";

const Chat = () => {
  const [open, setOpen] = useEvent("chatWindow", false);

  React.useEffect(() => {
    setTimeout(() => {
      handleAddResponseMessage("hello");
    }, 700);
  }, []);

  const handleClose = () => {
    setOpen("chatWindow", false);
  };

  return (
    <>
      <ChatWindow
        open={open}
        handleClose={handleClose}
        history={[{ message: "Welcome to nucleoid chat", user: false }]}
        handleNewUserMessage={(message) => console.log(message)}
      />
    </>
  );
};

export default Chat;
