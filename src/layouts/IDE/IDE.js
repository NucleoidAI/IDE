import Box from "@mui/material/Box";
import BusinessIcon from "@mui/icons-material/Business";
import Chat from "../../widgets/Chat";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import GlobalSnackMessage from "../../components/GlobalSnackMessage";
import Menu from "../../components/Menu";
//import Mobile from "../../pages/ide/Mobile";
import Onboard from "../../components/Onboard";
import ProcessDrawer from "../../widgets/ProcessDrawer/ProcessDrawer";
import React from "react";
import SendIcon from "@mui/icons-material/Send";
import Settings from "../../settings";
import StorageIcon from "@mui/icons-material/Storage";
import SwaggerDialog from "../../components/SwaggerDialog";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import styles from "./styles";
import theme from "../../theme";
import { useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom"; // eslint-disable-line

const list = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: <DashboardIcon />,
    anchor: false,
  },
  {
    title: "Business Flow",
    link: "/businessflow",
    icon: <BusinessIcon />,
    anchor: false,
  },
  { title: "API", link: "/api", icon: <SendIcon /> },
  {
    title: "Functions",
    link: "/functions",
    icon: <FolderIcon />,
  },
  { title: "Query", link: "/query", icon: <StorageIcon />, anchor: false },
  {
    title: "Logs",
    link: "/logs",
    icon: <ViewCarouselIcon />,
    anchor: false,
  },
];

const listMobile = [
  {
    title: "Dashboard",
    link: "/dashboard",
    icon: <DashboardIcon />,
    anchor: false,
  },
  {
    title: "Business Flow",
    link: "/businessflow",
    icon: <BusinessIcon />,
    anchor: false,
  },
];

function IDE() {
  const matchDownSM = useMediaQuery(theme.breakpoints.between("xs", "md"));

  return (
    <Box sx={styles.root}>
      <Menu
        list={matchDownSM && Settings.plugin() ? listMobile : list}
        title="IDE"
      />
      <Box sx={styles.content}>
        <Outlet />
      </Box>
      {Settings.landing().level < 5 && <Onboard />}
      <ProcessDrawer />
      <SwaggerDialog />
      <Chat />
      <GlobalSnackMessage />
    </Box>
  );
}

export default IDE;
