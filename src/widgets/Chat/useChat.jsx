import { useEvent } from "@nucleoidjs/react-event";
import { useEffect, useState } from "react";

const useChat = () => {
  const [selectedChat] = useEvent("CHAT_SELECTED");
  const [chat, setChat] = useState();

  useEffect(() => {
    setChat(selectedChat);
  }, [selectedChat]);

  const sendMessage = async (message) => {
    try {
      const response = await fetch(
        `https://nuc.land/ide/api/expert/chat/sessions/${chat.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: "USER",
            content: message,
          }),
        }
      );

      const data = await response.json();
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
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return [chat, sendMessage];
};

export default useChat;
