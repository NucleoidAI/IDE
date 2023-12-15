import ClosableDialogTitle from "../ClosableDialogTitle";
import NumberOne from "../../images/number-one.png";
import NumberThree from "../../images/number-three.png";
import NumberTwo from "../../images/number-two.png";
import React from "react";
import { Switch } from "@mui/material";
import codeImage from "../../images/code.png";
import onboardDispatcher from "../Onboard/onboardDispatcher";
import { storage } from "@nucleoidjs/webstorage";
import styles from "./styles";
import { useTheme } from "@mui/material/styles";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

const LandingDialog = () => {
  const [darkMode, setDarkMode] = React.useState(
    storage.get("platform", "theme") === "dark"
  );

  const handleThemeChange = (event) => {
    const newTheme = event.target.checked ? "dark" : "light";
    setDarkMode(event.target.checked);
    storage.set("platform", "theme", newTheme);
  };

  const handleClose = () => {
    onboardDispatcher({ level: 1 });
  };
  const theme = useTheme();
  return (
    <Dialog
      open={true}
      fullWidth
      maxWidth={"sm"}
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
      sx={styles.dialog}
      PaperProps={{
        style: {
          backgroundColor: theme.palette.custom.darkDialog,
          color: theme.palette.custom.grey,
        },
      }}
    >
      <ClosableDialogTitle grey handleClose={handleClose} />
      <DialogContent>
        <Box sx={styles.welcome}>
          <h2> Welcome to Nucleoid Project </h2>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ marginRight: 8 }}>Dark Mode</span>
          <Switch checked={darkMode} onChange={handleThemeChange} />
        </Box>

        <Box>
          Nucleoid low-code framework lets you build your APIs with the help of
          AI and built-in datastore.
        </Box>
        <Box sx={styles.content}>
          <Box sx={styles.howItWorks}>
            <h2>How it works</h2>
          </Box>
          <Box sx={styles.listRoot}>
            <List sx={styles.list}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={NumberOne}></Avatar>
                </ListItemAvatar>
                <ListItemText primary="Write your business logic in JavaScript" />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={NumberTwo}></Avatar>
                </ListItemAvatar>
                <ListItemText primary="Nucleoid renders your codes with AI" />
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar src={NumberThree}></Avatar>
                </ListItemAvatar>
                <ListItemText primary="Creates APIs with built-in datastore" />
              </ListItem>
            </List>
          </Box>
          <br />
          <Box sx={styles.footer}>
            <img src={codeImage} alt={"Code"} width={100} />
            <br />
            Happy coding!
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button sx={{ color: theme.palette.custom.grey }} onClick={handleClose}>
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LandingDialog;
