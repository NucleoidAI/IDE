import Drawer from "@mui/material/Drawer";
import Logo from "../Logo";
import ProjectSelect from "../../components/ProjectSelect";
import React from "react";
import Settings from "../Settings";
import Status from "../../widgets/Status";
import styles from "./styles";
import { useLayoutContext } from "../../Context/providers/layoutContextProvider";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";

function Menu(props) {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  //TODO : small version of the menu will be made with mediaquery
  if (isMdUp) {
    return (
      <nav style={styles.root}>
        <Drawer variant="permanent" sx={styles.drawer}>
          <List>
            <ListItem>
              <Logo title={props.title} />
            </ListItem>
            <br />
            <MenuLinks {...props} />
          </List>
          <ProjectSelect />
          <Status />
          <Settings />
        </Drawer>
      </nav>
    );
  } else {
    return (
      <nav style={styles.root}>
        <Drawer variant="permanent" sx={{ width: 10 }}>
          <List>
            <ListItem>
              <Logo title={props.title} />
            </ListItem>
            <br />
            <MenuLinks {...props} />
          </List>
          <ProjectSelect />
          <Status />
          <Settings />
        </Drawer>
      </nav>
    );
  }
}

const MenuLinks = (props) => {
  const [layoutContext] = useLayoutContext();
  const navigate = useNavigate();

  return (
    <>
      {props.list.map(({ title, link, anchor, icon }) => (
        <React.Fragment key={title}>
          <ListItem
            disabled={
              title === "Logs" && layoutContext.status === "unreachable"
            }
            sx={styles.listItem}
            onClick={() => navigate(link, { state: { anchor } })}
            button
          >
            <ListItemIcon sx={styles.listItemIcon}>{icon}</ListItemIcon>
            <ListItemText primary={title} />
          </ListItem>
        </React.Fragment>
      ))}
    </>
  );
};

export default Menu;
