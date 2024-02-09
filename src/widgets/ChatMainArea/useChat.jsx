import { useState, useEffect } from "react";

const mockChats = [
  {
    id: "0",
    messages: [
      {
        sender: "ai",
        text: "The Earth's circumference is about 40,075 kilometers.",
      },
      { sender: "human", text: "That's interesting! How was this measured?" },
      {
        sender: "ai",
        text: "It was first accurately measured by Eratosthenes in 240 BC.",
      },
      { sender: "human", text: "Did he use any special tools?" },
      {
        sender: "ai",
        text: "Yes, he used the shadows cast by sticks and the distance between two cities to make his calculations.",
      },
    ],
  },
  {
    id: "1",
    messages: [
      { sender: "human", text: "Why is centering a div so complicated?" },
      {
        sender: "ai",
        text: "It's a rite of passage for many front-end developers.",
      },
      { sender: "human", text: "So, what's the easiest way to center a div?" },
      {
        sender: "ai",
        text: "Using CSS Flexbox: display: flex; justify-content: center; align-items: center;",
      },
      { sender: "human", text: "Flexbox really is a game-changer, isn't it?" },
    ],
  },
  {
    id: "2",
    messages: [
      {
        sender: "ai",
        text: "Blind people can dream through other senses like sound, smell, and touch.",
      },
      { sender: "human", text: "Do they see visual images in their dreams?" },
      {
        sender: "ai",
        text: "Those who weren't born blind may see images, but those born blind dream with non-visual senses.",
      },
      {
        sender: "human",
        text: "That's quite profound. It's like a different way of seeing the world.",
      },
      {
        sender: "ai",
        text: "Exactly, dreams are subjective and can encompass more than just the visual.",
      },
    ],
  },
  {
    id: "3",
    messages: [
      { sender: "human", text: "What's the problem of criterion?" },
      {
        sender: "ai",
        text: "It's a philosophical issue about the starting points of knowledge. How can we know without knowing the criterion for knowledge?",
      },
      {
        sender: "human",
        text: "So, it's like asking which came first, the chicken or the egg?",
      },
      {
        sender: "ai",
        text: "In a way, yes. It challenges us to consider how we justify what we claim to know.",
      },
      {
        sender: "human",
        text: "Philosophy always leaves me with more questions than answers.",
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
