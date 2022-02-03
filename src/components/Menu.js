import Drawer from "@mui/material/Drawer";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import React from "react";
import Settings from "./Settings";
import Status from "./Status";
import makeStyles from '@mui/styles/makeStyles';
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

const width = 300;

export const useStyles = makeStyles((theme) => ({
  root: {
    width,
    flexShrink: 0,
  },
  drawer: {
    width,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  item: {
    background: "#353e48",
    color: "rgba(255, 255, 255, 0.7)",
    "&:hover,&:focus": {
      color: "rgba(255, 255, 255, 1)",
    },
  },
  icon: {
    color: theme.palette.custom.grey,
  },
}));

function Menu(props) {
  const classes = useStyles();

  return (
    <nav className={classes.root}>
      <Drawer
        variant="permanent"
       
        classes={{
          paper: classes.drawer,
        }}
      >
        <List>
          <ListItem>
            <Logo title={props.title} />
          </ListItem>
          <br />
          {props.list.map(({ title, link, icon }) => (
            <React.Fragment key={title}>
              <ListItem
                className={classes.item}
                component={Link}
                to={link}
                button
              >
                <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
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
