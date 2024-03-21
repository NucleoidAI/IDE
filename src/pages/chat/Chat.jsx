import ChatContent from "../../widgets/Chat";
import ChatLayout from "../../layouts/ChatLayout";
import Page from "../../components/Page";
import { publish } from "@nucleoidjs/react-event";

import React, { useEffect } from "react";

function Chat() {
  useEffect(() => {
    publish("CONTAINER_LOADING_COMPLETED");
  }, []);
  return (
    <Page title="Chat">
      <ChatLayout content={<ChatContent />} />
    </Page>
  );
}

export default Chat;
