import { useState, useEffect } from "react";

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

  useEffect(() => {
    const foundChat = mockChats.find((c) => c.id === chatId.toString());
    setChat(foundChat);
  }, [chatId]);

  return chat;
};

export default useChat;
