import Drawer from "@mui/material/Drawer";
import Logo from "../Logo";
import React from "react";
import Settings from "../Settings";
import Status from "../../widgets/Status";
import styles from "./styles";

import { useApiStatusStore } from "../../Context/providers/ApiStatusStoreProvider";
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

function Menu(props) {
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
        <Status />
        <Settings />
      </Drawer>
    </nav>
  );
}

const MenuLinks = (props) => {
  const [layoutContext] = useApiStatusStore();
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
