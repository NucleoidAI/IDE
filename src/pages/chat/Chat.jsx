import ChatLayout from "../../layouts/ChatLayout";
import ChatMainArea from "../../widgets/ChatMainArea";
import ChatSideBar from "../../widgets/ChatSideBar";
import Page from "../../components/Page";
import { publish } from "@nucleoidjs/react-event";

import React, { useEffect } from "react";

function Chat() {
  useEffect(() => {
    publish("EDITOR_LOADING_COMPLETED", true);
  }, []);
  return (
    <Page title="Chat">
      <ChatLayout
        chatContent={<ChatMainArea />}
        sidebarContent={<ChatSideBar />}
      />
    </Page>
  );
}

export default Chat;
