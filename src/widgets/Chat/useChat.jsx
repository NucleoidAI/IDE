import { v4 as uuidv4 } from "uuid";

import { storage, useStorage } from "@nucleoidjs/webstorage";
import { useEffect, useState } from "react";

const useChat = () => {
  const [chat, setChat] = useState(null);
  const [selectedChatId] = useStorage("selected", "chat", "id", -1);

  useEffect(() => {
    if (selectedChatId === -1) {
      const newChatId = uuidv4();
      const currentTime = new Date().getTime();
      const newChat = {
        id: newChatId,
        title: "New Chat",
        messages: [],
        timestamp: currentTime,
      };
      setChat(newChat);
    } else {
      const chatKey = `chat.${selectedChatId}`;
      const storedChat = localStorage.getItem(chatKey);
      if (storedChat) {
        setChat(JSON.parse(storedChat));
      }
    }
  }, [selectedChatId]);

  function updateChat(message) {
    setChat((currentChat) => {
      const updatedMessages = [...currentChat.messages, message];
      const updatedChat = { ...currentChat, messages: updatedMessages };
      localStorage.setItem(`chat.${chat.id}`, JSON.stringify(updatedChat));
      return updatedChat;
    });
  }
  const sendMessage = async (message, setLoading) => {
    if (selectedChatId === -1) {
      const chatKey = `chat.${chat.id}`;
      localStorage.setItem(chatKey, JSON.stringify(chat));
      storage.set("selected", "chat", "id", chat.id);
    }
    const newMessage = {
      user: "human",
      prompt: message,
    };

    updateChat(newMessage);
    setLoading(true);

    try {
      const response = await fetch(
        `https://nuc.land/ide/api/expert/chat/sessions/${chat.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            context: ["string"],
            prompt: message,
          }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok.");

      const data = await response.json();
      const responseMessage = {
        user: "ai",
        ...data,
      };
      console.log("responseMessage", responseMessage);
      if (data.code) {
        responseMessage.code = data.code;
      }
      updateChat(responseMessage);
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return { chat: chat, sendMessage };
};

export default useChat;
