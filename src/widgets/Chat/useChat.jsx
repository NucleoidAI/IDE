import { publish } from "@nucleoidjs/react-event";
import { v4 as uuidv4 } from "uuid";

import { useEffect, useState } from "react";

const mockChats = [
  {
    title: "Circumference of the Earth",
    messages: [],
    id: 0,
  },
  {
    title: "Centering a Div",
    messages: [
      {
        sender: "human",
        text: "Why does centering a div feel like rocket science?",
      },
      {
        sender: "ai",
        text: "It's a common challenge, but CSS Flexbox makes it much easier: use `display: flex; justify-content: center; align-items: center;`.",
        code: "div {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}",
      },
    ],
    id: 1,
  },
  {
    title: "Blind People's Dreams",
    messages: [
      { sender: "human", text: "How do blind people experience dreams?" },
      {
        sender: "ai",
        text: "Individuals who are blind dream through their other senses like sound, smell, and touch. Those who have lost their sight may have visual dreams, but those born blind experience dreams without visual images.",
        code: "interface Dream {\n  sounds?: string[];\n  smells?: string[];\n  touches?: string[];\n}",
      },
    ],
    id: 2,
  },
  {
    id: "3",
    title: "The Problem of Criterion",
    messages: [
      {
        sender: "human",
        text: "I stumbled upon the 'problem of criterion'. Can you shed some light on it?",
      },
      {
        sender: "ai",
        text: "Certainly! The problem of criterion is a philosophical puzzle concerning our starting points for knowledge. It asks how we can know anything without first knowing the criteria for what counts as knowledge.",
        code: "interface Knowledge {\n  criteria: string[];\n  validate(criteria: string): boolean;\n}",
      },
    ],
  },
];

const useChat = (chatId) => {
  const [chat, setChat] = useState(null);

  const initializeMockChats = () => {
    mockChats.forEach((chat) => {
      const chatKey = `chat.${chat.id}`;
      const currentTime = new Date().getTime();
      if (!localStorage.getItem(chatKey)) {
        const chatWithTimestamp = {
          ...chat,
          timestamp: currentTime,
        };
        localStorage.setItem(chatKey, JSON.stringify(chatWithTimestamp));
      }
    });
  };
  initializeMockChats();

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
