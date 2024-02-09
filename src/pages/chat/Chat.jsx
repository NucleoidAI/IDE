import React, { useEffect } from "react";
import Page from "../../components/Page";
import ChatLayout from "../../layouts/ChatLayout";
import ChatSideBar from "../../widgets/ChatSideBar";
import ChatMainArea from "../../widgets/ChatMainArea";
import { publish } from "@nucleoidjs/react-event";

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
