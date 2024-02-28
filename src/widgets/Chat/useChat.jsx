import { v4 as uuidv4 } from "uuid";

import { storage, useStorage } from "@nucleoidjs/webstorage";
import { useEffect, useRef } from "react";

const mockChats = [
  {
    id: "0",
    title: "Circumference of the Earth",
    messages: [
      {
        sender: "human",
        text: "Can anyone tell me the Earth's circumference?",
      },
      {
        sender: "ai",
        text: "Absolutely, the Earth's circumference measures approximately 40,075 kilometers.",
        code: "const earthCircumferenceKm: number = 40075;",
      },
      {
        sender: "human",
        text: "Wow, that's vast! How could someone possibly measure that?",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
        code: "function calculateCircumference(earthRadiusKm: number): number {\n  return 2 * Math.PI * earthRadiusKm;\n}",
      },
    ],
    uuid: uuidv4(),
  },
  {
    id: "1",
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
    uuid: uuidv4(),
  },
  {
    id: "2",
    title: "Blind People's Dreams",
    messages: [
      { sender: "human", text: "How do blind people experience dreams?" },
      {
        sender: "ai",
        text: "Individuals who are blind dream through their other senses like sound, smell, and touch. Those who have lost their sight may have visual dreams, but those born blind experience dreams without visual images.",
        code: "interface Dream {\n  sounds?: string[];\n  smells?: string[];\n  touches?: string[];\n}",
      },
    ],
    uuid: uuidv4(),
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
    uuid: uuidv4(),
  },
];

const useChat = (chatId) => {
  const [chatData] = useStorage("chat", mockChats);
  const chatRef = useRef();
  chatRef.current = chatData.find((c) => c.id === chatId.toString());

  useEffect(() => {
    chatRef.current = chatData.find((c) => c.id === chatId.toString());
  }, [chatId, chatData]);

  function updateChat(message) {
    chatRef.current.messages.push(message);
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
        `https://nuc.land/ide/api/expert/chat/sessions/${chatRef.current.uuid}`,
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
    storage.set(
      "chat",
      chatData.map((item) =>
        item.id === chatRef.current.id ? chatRef.current : item
      )
    );
  };

  return { chat: chatRef.current, sendMessage };
};

export default useChat;
