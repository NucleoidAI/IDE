import Project from "../../lib/Project";
import expert from "../../http/expert.js";
import { startTransition } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
        chatId: chat.id,
        status: true,
        type: response.data.type,
        content: response.data.content,
      });
    }
  };

  const convertChat = () => {
    const { id, messages } = chat;

    const blocks = [];

    messages.forEach((message) => {
      if (message.code) {
        blocks.push(message.code);
      }
    });

    const { api, functions, declarations } = Project.compile(blocks);

    // TODO Restructure project context
    const project = {
      specification: {
        api: api,
        functions: functions,
        declarations: declarations,
        types: [],
      },
      project: {
        id,
        type: "CHAT",
        name: "Chat Project",
        description: "This project has been converted from chat",
      },
    };

    localStorage.setItem(`ide.context.${id}`, JSON.stringify(project));
    publish("CHAT_CONVERTED", chat);

    startTransition(() => {
      navigate(`/${id}/api?mode=local`);
    });
  };

  const deleteChat = () => {
    publish("CHAT_DELETED", chat);
  };

  return [chat, sendMessage, convertChat, deleteChat];
};

export default useChat;
