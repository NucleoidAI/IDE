import ChatContent from "../../widgets/Chat";
import ChatLayout from "../../layouts/ChatLayout";
import Page from "../../components/Page";

import React, { useEffect } from "react";
import { publish, useEvent } from "@nucleoidai/react-event";

function Chat() {
  const [event] = useEvent("WIDGET_LOADED", { name: null });

  useEffect(() => {
    if (event.name) {
      publish("PAGE_LOADED", {
        name: "Chat",
      });
    }
  }, [event.name]);

  return (
    <Page title="Chat">
      <ChatLayout content={<ChatContent />} />
    </Page>
  );
}

export default Chat;
