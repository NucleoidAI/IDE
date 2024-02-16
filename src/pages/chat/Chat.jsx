import ChatLayout from "../../layouts/ChatLayout";
import ChatMainArea from "../../widgets/ChatMainArea";
import Page from "../../components/Page";
import { publish } from "@nucleoidjs/react-event";

import React, { useEffect } from "react";

function Chat() {
  useEffect(() => {
    publish("EDITOR_LOADING_COMPLETED", true);
  }, []);
  return (
    <Page title="Chat">
      <ChatLayout content={<ChatMainArea />} />
    </Page>
  );
}

export default Chat;
