import Drawer from "@mui/material/Drawer";
import React from "react";
import Stack from "@mui/material/Stack";
import { useEvent } from "@nucleoidai/react-event";

function ChatDrawer() {
  const [chatDrawerOpened, publish] = useEvent("CHAT_DRAWER_OPENED", false);

  const handleClose = () => {
    publish("CHAT_DRAWER_OPENED", false);
  };

  return (
    <React.Fragment>
      <Drawer anchor="right" open={chatDrawerOpened} onClose={handleClose}>
        <Stack width={"100%"}>i am chat</Stack>
      </Drawer>
    </React.Fragment>
  );
}

export default ChatDrawer;
