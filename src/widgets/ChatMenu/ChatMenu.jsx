import AddIcon from "@mui/icons-material/Add";
import Drawer from "@mui/material/Drawer";
import LgDrawerStyled from "../../components/LgDrawerStyled";
import Logo from "../../components/Logo";
import React from "react";
import Settings from "../../components/Settings";
import SmallLogo from "../../components/SmallLogo";
import { drawerWidth } from "../../config";
import styles from "./styles";
import { useTheme } from "@mui/material/styles";

import { ArrowForwardIos, DensityMedium } from "@mui/icons-material/";
import {
  Box,
  Button,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { storage, useStorage } from "@nucleoidjs/webstorage";
import { useEffect, useState } from "react";

function ChatMenu(props) {
  const [openMd, setOpenMd] = React.useState(false);
  const [openLg, setOpenLg] = React.useState(true);
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  const handleClose = () => {
    setOpenMd(false);
  };

  const handleCreateNewChat = () => {
    storage.set("selected", "chat", "id", "-1");
  };

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 } }}>
      {matchDownMD ? (
        <>
          {!openMd && (
            <Drawer
              variant="permanent"
              sx={{
                width: 75,
                "& .MuiDrawer-paper": {
                  width: 75,
                },
              }}
            >
              <List>
                <ListItem onClick={() => setOpenMd(true)}>
                  <SmallLogo />
                </ListItem>
                <br />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Fab
                    variant="button"
                    edge="start"
                    size="small"
                    onClick={handleCreateNewChat}
                    sx={{ alignSelf: "center", my: 2 }}
                  >
                    <AddIcon />
                  </Fab>
                </Box>
              </List>

              <Box sx={{ height: "100%" }} />

              <Settings size={"large"} />
              <Button sx={{ pb: 3 }} onClick={() => setOpenMd(true)}>
                <ArrowForwardIos
                  fontSize="small"
                  sx={{ fill: theme.palette.custom.grey }}
                />
              </Button>
            </Drawer>
          )}
          <Drawer
            open={openMd}
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            variant="temporary"
            sx={{
              display: { xs: "block", lg: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRight: `1px solid ${theme.palette.divider}`,
                backgroundImage: "none",
                boxShadow: "inherit",
              },
            }}
          >
            <List>
              <ListItem>
                <Logo title={props.title} />
                <IconButton
                  variant={"contained"}
                  onClick={() => setOpenMd(false)}
                >
                  <DensityMedium
                    fontSize="medium"
                    sx={{ fill: theme.palette.custom.grey }}
                  />
                </IconButton>
              </ListItem>
              <br />
            </List>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Fab
                variant="button"
                edge="start"
                size="small"
                onClick={handleCreateNewChat}
                sx={{ alignSelf: "center", my: 2 }}
              >
                <AddIcon />
              </Fab>
            </Box>
            <ChatHistory />
            <Box sx={{ height: "100%" }} />

            <Settings size={"large"} />
          </Drawer>
        </>
      ) : (
        <>
          {!openLg && (
            <Drawer
              variant="permanent"
              sx={{
                width: 75,
                "& .MuiDrawer-paper": {
                  width: 75,
                },
              }}
            >
              <List>
                <ListItem onClick={() => setOpenLg(true)}>
                  <SmallLogo />
                </ListItem>
                <br />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Fab
                    variant="button"
                    edge="start"
                    size="small"
                    onClick={handleCreateNewChat}
                    sx={{ alignSelf: "center", my: 2 }}
                  >
                    <AddIcon />
                  </Fab>
                </Box>
              </List>

              <Box sx={{ height: "100%" }} />

              <Settings size={"large"} />
              <Button sx={{ pb: 3 }} onClick={() => setOpenLg(true)}>
                <ArrowForwardIos
                  fontSize="small"
                  sx={{
                    fill: theme.palette.custom.grey,
                  }}
                />
              </Button>
            </Drawer>
          )}
          <LgDrawerStyled variant="permanent" open={openLg}>
            <List>
              <ListItem>
                <Logo title={props.title} />
                <IconButton
                  variant={"contained"}
                  onClick={() => setOpenLg(false)}
                >
                  <DensityMedium
                    fontSize="medium"
                    sx={{ fill: theme.palette.custom.grey }}
                  />
                </IconButton>
              </ListItem>
            </List>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Fab
                variant="button"
                edge="start"
                size="small"
                onClick={handleCreateNewChat}
                sx={{ alignSelf: "center", my: 2 }}
              >
                <AddIcon />
              </Fab>
            </Box>
            <ChatHistory />
            <Box sx={{ height: "100%" }} />
            <Settings size={"large"} />
          </LgDrawerStyled>
        </>
      )}
    </Box>
  );
}

const ChatHistory = () => {
  const [chats, setChats] = useState([]);
  const [selectedChatId] = useStorage("selected", "chat", "id", "-1");

  const handleChatClick = (chatId) => {
    storage.set("selected", "chat", "id", chatId);
    console.debug(`Chat clicked: ${chatId}`);
  };

  useEffect(() => {
    const loadedChats = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith("chat.")) {
        try {
          const chatData = JSON.parse(localStorage.getItem(key));
          if (chatData) {
            loadedChats.push({
              chatId: chatData.id,
              chatTitle: chatData.title,
              timestamp: chatData.timestamp,
            });
          }
        } catch (e) {
          console.error("Error parsing chat data from local storage:", e);
        }
      }
    }
    loadedChats.sort((a, b) => b.timestamp - a.timestamp);
    setChats(loadedChats);
  }, [selectedChatId]);

  return (
    <Box sx={{ marginTop: "10px" }}>
      {chats.map((chat) => (
        <React.Fragment key={chat.chatId}>
          <ListItemButton
            onClick={() => handleChatClick(chat.chatId)}
            sx={styles.listItem}
          >
            <ListItemText
              primary={chat.chatTitle}
              sx={{
                ".MuiListItemText-primary": {
                  position: "relative",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </ListItemButton>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default ChatMenu;
