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
      },
      {
        sender: "human",
        text: "Wow, that's vast! How could someone possibly measure that?",
      },
      {
        sender: "ai",
        text: "Eratosthenes, a Greek mathematician, did it in 240 BC with an ingenious method using sticks' shadows and calculating the distance between two cities.",
      },
      {
        sender: "human",
        text: "Genius indeed! Did his method involve a lot of math?",
      },
      {
        sender: "ai",
        text: "Yes, it required understanding of geometry and the concept of angles. His calculation was remarkably accurate for his time.",
      },
      {
        sender: "human",
        text: "Incredible to think about the brains some people have!",
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
      },
      {
        sender: "human",
        text: "Flexbox to the rescue again! Why isn't this the first thing they teach in CSS 101?",
      },
      {
        sender: "ai",
        text: "It should be! Flexbox and CSS Grid are transformative for layout design, making these tasks straightforward.",
      },
      {
        sender: "human",
        text: "Guess it's time to dive deeper into Flexbox. Any resources you recommend?",
      },
      {
        sender: "ai",
        text: "Absolutely, the CSS-Tricks guide to Flexbox is comprehensive and very beginner-friendly.",
      },
      {
        sender: "human",
        text: "Thanks! I'll check it out and conquer that div once and for all!",
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
      },
      {
        sender: "human",
        text: "That's quite a revelation. Does it mean their dream world is just as rich?",
      },
      {
        sender: "ai",
        text: "Absolutely. Their dreams are rich with sensory experiences that compensate for the lack of visuals, offering a vivid and meaningful dreamscape.",
      },
      {
        sender: "human",
        text: "So in a way, their perception of reality and dreams could be more intense than seeing people?",
      },
      {
        sender: "ai",
        text: "Potentially, yes. The brain adapts by enhancing the other senses, which can make those experiences more intense and detailed.",
      },
      {
        sender: "human",
        text: "Mind-blowing. It really opens up a new perspective on sensory experience and adaptation.",
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
      },
      {
        sender: "human",
        text: "Sounds like a chicken and egg problem. How do philosophers approach solving it?",
      },
      {
        sender: "ai",
        text: "It's indeed similar to the chicken and egg problem. Philosophers approach it through various theories, but no single solution is universally accepted. It's about challenging and understanding the foundations of our knowledge.",
      },
      {
        sender: "human",
        text: "That must lead to some heated debates. Any famous philosophers I should look into for more insights?",
      },
      {
        sender: "ai",
        text: "Absolutely, you might find the works of Chisholm, Sextus Empiricus, and Laurence BonJour particularly illuminating on this topic.",
      },
      {
        sender: "human",
        text: "Thanks! Philosophy really has a way of making you question everything you thought you knew.",
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
