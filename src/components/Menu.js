import Drawer from "@mui/material/Drawer";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import React from "react";
import Settings from "./Settings";
import Status from "./Status";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

function Menu(props) {
  return (
    <nav style={{ width: 300, flexShrink: 0 }}>
      <Drawer
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 300,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
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
                sx={{
                  background: "#353e48",
                  color: "rgba(255, 255, 255, 0.7)",
                  "&:hover,&:focus": {
                    color: "rgba(255, 255, 255, 1)",
                  },
                }}
                component={Link}
                to={link}
                button
              >
                <ListItemIcon sx={{ color: "custom.grey" }}>
                  {icon}
                </ListItemIcon>
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
