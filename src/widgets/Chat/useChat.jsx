import expert from "../../http/expert.js";
import { publish, useEvent } from "@nucleoidai/react-event";
import { useEffect, useState } from "react";

const useChat = () => {
  const [selectedChat] = useEvent("CHAT_SELECTED");
  const [chat, setChat] = useState();

  useEffect(() => {
    setChat(selectedChat);
  }, [selectedChat]);

  const sendMessage = async (message) => {
    try {
      const { data } = await expert.post(`/chat/sessions/${chat.id}`, {
        role: "USER",
        content: message,
      });

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
    } catch ({ response }) {
      publish("EXPERT_ERROR_OCCURRED", {
        status: true,
        type: response.data.type,
        content: response.data.content,
      });
    }
  };

  return [chat, sendMessage];
};

export default useChat;
