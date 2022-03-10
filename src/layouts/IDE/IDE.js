import FolderIcon from "@mui/icons-material/Folder";
import Grid from "@mui/material/Grid";
import Menu from "../../components/Menu";
import ProcessDrawer from "../../widgets/ProcessDrawer/ProcessDrawer";
import SendIcon from "@mui/icons-material/Send";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import StorageIcon from "@mui/icons-material/Storage";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import styles from "./styles";
import { Outlet } from "react-router-dom"; // eslint-disable-line

const list = [
  { title: "API", link: "/", icon: <SendIcon /> },
  {
    title: "Functions",
    link: "/ide/functions",
    icon: <FolderIcon />,
  },
  { title: "Query", link: "/ide/query", icon: <StorageIcon />, anchor: false },
  {
    title: "Branches",
    link: "/ide/branches",
    icon: <SettingsEthernetIcon />,
    anchor: false,
  },
  {
    title: "Logs",
    link: "/ide/logs",
    icon: <ViewCarouselIcon />,
    anchor: false,
  },
];

function IDE() {
  return (
    <>
      <Grid sx={styles.root}>
        <Menu list={list} title="IDE" />
        <Grid sx={styles.content}>
          <Grid sx={styles.childrens}>
            <Outlet />
          </Grid>
        </Grid>
      </Grid>
      <ProcessDrawer />
    </>
  );
}

export default IDE;
