import Drawer from "@mui/material/Drawer";
import { Link } from "react-router-dom";
import Logo from "../Logo";
import React from "react";
import Settings from "../Settings";
import Status from "../Status";
import styles from "./styles";
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
          {props.list.map(({ title, link, icon }) => (
            <React.Fragment key={title}>
              <ListItem sx={styles.listItem} component={Link} to={link} button>
                <ListItemIcon sx={styles.listItemIcon}>{icon}</ListItemIcon>
                <ListItemText primary={title} />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
        <Status />
        <Settings />
      </Drawer>
    </nav>
  );
}

export default Menu;
