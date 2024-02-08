import React from "react";
import Page from "../../components/Page";
import ChatLayout from "../../layouts/ChatLayout";
import ChatSideBar from "../../widgets/ChatSideBar";
import ChatMainArea from "../../widgets/ChatMainArea";

function Chat() {
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
