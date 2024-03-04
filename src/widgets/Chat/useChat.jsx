import { publish } from "@nucleoidjs/react-event";
import { v4 as uuidv4 } from "uuid";

import { useEffect, useState } from "react";

const useChat = (chatId) => {
  const [chat, setChat] = useState(null);

  useEffect(() => {
    if (chatId === "-1") {
      const newChatId = uuidv4();
      const currentTime = new Date().getTime();
      const newChat = {
        id: newChatId,
        title: "New Chat",
        messages: [],
        timestamp: currentTime,
      };

      const chatKey = `chat.${newChatId}`;
      localStorage.setItem(chatKey, JSON.stringify(newChat));
      setChat(newChat);
      publish("CHAT_ID_CHANGED", newChatId);
    } else {
      const chatKey = `chat.${chatId}`;
      const storedChat = localStorage.getItem(chatKey);
      if (storedChat) {
        setChat(JSON.parse(storedChat));
      } else {
        const initialChat = mockChats.find((c) => c.id === chatId.toString());
        if (initialChat) {
          localStorage.setItem(chatKey, JSON.stringify(initialChat));
          setChat(initialChat);
        }
      }
    }
  }, [chatId]);

  function updateChat(message) {
    setChat((currentChat) => {
      const updatedMessages = [...currentChat.messages, message];
      const updatedChat = { ...currentChat, messages: updatedMessages };
      localStorage.setItem(`chat.${chatId}`, JSON.stringify(updatedChat));
      return updatedChat;
    });
  }
  const sendMessage = async (message, setLoading) => {
    const newMessage = {
      sender: "human",
      text: message,
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
      if (data.type === "DECLARATIVE") {
        setChat((currentChat) => {
          const updatedPrompts = currentChat.prompts
            ? [...currentChat.prompts, data]
            : [data];
          const updatedChat = {
            ...currentChat,
            prompts: updatedPrompts,
          };
          localStorage.setItem(`chat.${chatId}`, JSON.stringify(updatedChat));
          return updatedChat;
        });
      }
      let responseText = "";
      if (data.description) {
        responseText = data.description;
      } else if (data.prompt) {
        responseText = data.prompt;
      } else {
        responseText = "Received a response without a description.";
      }

      const responseMessage = {
        sender: "ai",
        text: responseText,
      };

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
