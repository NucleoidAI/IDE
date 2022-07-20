import Box from "@mui/material/Box";
import FolderIcon from "@mui/icons-material/Folder";
import Menu from "../../components/Menu";
import Onboard from "../../components/Onboard";
import ProcessDrawer from "../../widgets/ProcessDrawer/ProcessDrawer";
import SendIcon from "@mui/icons-material/Send";
import Settings from "../../settings";
import StorageIcon from "@mui/icons-material/Storage";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import styles from "./styles";
import { Outlet } from "react-router-dom"; // eslint-disable-line

const list = [
  { title: "API", link: "/", icon: <SendIcon /> },
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

function IDE() {
  return (
    <Box sx={styles.root}>
      <Menu list={list} title="IDE" />
      <Box sx={styles.content}>
        <Outlet />
      </Box>
      {Settings.landing().level < 4 && <Onboard />}
      <ProcessDrawer />
    </Box>
  );
}

export default IDE;
