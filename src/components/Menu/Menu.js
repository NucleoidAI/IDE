import Drawer from "@mui/material/Drawer";
import Logo from "../Logo";
import React from "react";
import Settings from "../Settings";
import Status from "../Status";
import styles from "./styles";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link } from "react-router-dom"; // eslint-disable-line

function Menu(props) {
  // const navigate = useNavigate();
  console.log("menu renderlendi?");

  return (
    <nav style={styles.root}>
      <Drawer variant="permanent" sx={styles.drawer}>
        <List>
          <ListItem>
            <Logo title={props.title} />
          </ListItem>
          <br />
          {props.list.map(({ title, link, anchor, icon }) => (
            <React.Fragment key={title}>
              <Link to={link}>
                <ListItem sx={styles.listItem} button>
                  <ListItemIcon sx={styles.listItemIcon}>{icon}</ListItemIcon>
                  <ListItemText primary={title} />
                </ListItem>
              </Link>
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
