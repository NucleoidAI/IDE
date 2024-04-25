import Drawer from "@mui/material/Drawer";
import React from "react";
import SideChat from "../SideChat/SideChat";
import { useEvent } from "@nucleoidai/react-event";
function ChatDrawer() {
  const [chatDrawerOpened, publish] = useEvent("CHAT_DRAWER_OPENED", false);

  const handleClose = () => {
    publish("CHAT_DRAWER_OPENED", false);
  };

  return (
    <React.Fragment>
      <Drawer anchor="right" open={chatDrawerOpened} onClose={handleClose}>
        <SideChat />
      </Drawer>
    </React.Fragment>
  );
}

export default ChatDrawer;
