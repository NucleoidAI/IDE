import ClosableDialogTitle from "../ClosableDialogTitle";
import { Divider } from "@mui/material";
import NumberOne from "../../images/number-one.png";
import NumberThree from "../../images/number-three.png";
import NumberTwo from "../../images/number-two.png";
import React from "react";
import { Switch } from "@mui/material";
import codeImage from "../../images/code.png";
import onboardDispatcher from "../Onboard/onboardDispatcher";
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
import { storage, useStorage } from "@nucleoidjs/webstorage";

const LandingDialog = () => {
  const [themeStorage] = useStorage("platform", "theme", "light");

  const handleThemeChange = (event) => {
    const newTheme = event.target.checked ? "dark" : "light";

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
                <ListItemText primary="Write your business logic in TypeScript" />
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
      <Divider sx={{ marginY: 2 }} />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
          marginBottom: 1,
        }}
      >
        <Typography variant="body2" sx={{ marginRight: 1 }}>
          Light
        </Typography>
        <Switch
          checked={themeStorage !== "light"}
          onChange={handleThemeChange}
        />
        <Typography variant="body2" sx={{ marginLeft: 1 }}>
          Dark
        </Typography>
      </Box>
      <DialogActions>
        <Button
          data-cy="landing-dialog-close-button"
          sx={{ color: theme.palette.custom.grey }}
          onClick={handleClose}
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LandingDialog;
