import expert from "../../http/expert.js";
import { v4 as uuid } from "uuid";
import { publish, useEvent } from "@nucleoidai/react-event";
import { useEffect, useState } from "react";

const initChat = {
  id: uuid(),
  title: "New Chat",
  messages: [],
};

const useChat = () => {
  const [selectedChat] = useEvent("CHAT_SELECTED", initChat);
  const [chat, setChat] = useState(initChat);

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

      publish("CHAT_MESSAGE_RESPONDED", updatedChat);
      setChat(updatedChat);
    } catch ({ response }) {
      publish("EXPERT_ERROR_OCCURRED", {
        status: true,
        type: response.data.type,
        content: response.data.content,
      });
    }
  };

  const convertChat = () => {
    publish("CHAT_CONVERTED", chat);
  };

  const deleteChat = () => {
    publish("CHAT_DELETED", chat);
  };

  return [chat, sendMessage, convertChat, deleteChat];
};

export default useChat;
