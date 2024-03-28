import AddIcon from "@mui/icons-material/Add";
import ChatHistory from "./ChatHistory";
import Drawer from "@mui/material/Drawer";
import LgDrawerStyled from "../../components/LgDrawerStyled";
import Logo from "../../components/Logo";
import React from "react";
import Settings from "../../components/Settings";
import SmallLogo from "../../components/SmallLogo";
import { drawerWidth } from "../../config";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import { ArrowForwardIos, DensityMedium, Menu } from "@mui/icons-material/";
import {
  Box,
  Button,
  Fab,
  IconButton,
  List,
  ListItem,
  useMediaQuery,
} from "@mui/material";

function ChatMenu(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openMd, setOpenMd] = React.useState(false);
  const [openLg, setOpenLg] = React.useState(true);
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCreateNewChat = () => navigate("/chat");
  const handleClose = () => setOpenMd(false);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 } }}>
      {matchDownSM ? (
        <>
          <Fab
            variant="button"
            onClick={() => setOpenMd(true)}
            sx={{ position: "fixed", top: 16, left: 16, zIndex: 1200 }}
          >
            <Menu />
          </Fab>
          <Drawer
            open={openMd}
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            variant="temporary"
            sx={{
              display: { xs: "block", sm: "none" },
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
      ) : matchDownMD ? (
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

export default ChatMenu;
