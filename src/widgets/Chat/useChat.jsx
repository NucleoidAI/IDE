import expert from "../../http/expert.js";
import { useEvent } from "@nucleoidjs/react-event";
import { useEffect, useState } from "react";

const useChat = () => {
  const [selectedChat] = useEvent("CHAT_SELECTED");
  const [chat, setChat] = useState();

  useEffect(() => {
    setChat(selectedChat);
  }, [selectedChat]);

  const sendMessage = async (message) => {
    const { data } = await expert.post(
      `https://nuc.land/ide/api/expert/chat/sessions/${chat.id}`,
      {
        role: "USER",
        content: message,
      }
    );

    const assistantMessage = {
      role: "assistant",
      ...data,
    };

    const updatedMessages = [
      ...chat.messages,
      { role: "USER", content: message },
      assistantMessage,
    ];
    const updatedChat = { ...chat, messages: updatedMessages };
    localStorage.setItem(
      `ide.chat.sessions.${chat.id}`,
      JSON.stringify(updatedChat)
    );

    setChat(updatedChat);
  };

  return [chat, sendMessage];
};

export default useChat;
