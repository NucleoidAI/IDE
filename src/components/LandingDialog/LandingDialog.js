import ClosableDialogTitle from "../ClosableDialogTitle";
import NumberOne from "../../images/number-one.png";
import NumberThree from "../../images/number-three.png";
import NumberTwo from "../../images/number-two.png";
import React from "react";
import theme from "../../theme";
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
} from "@mui/material";

const LandingDialog = () => {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("landing", true);
  };
  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth={"sm"}
      onClose={(event) => (event.key === "Escape" ? handleClose() : null)}
      sx={{ bgcolor: "custom.darkDialogBg" }}
      PaperProps={{
        style: {
          backgroundColor: theme.palette.custom.darkDialogPanel,
          color: theme.palette.custom.grey,
        },
      }}
    >
      <ClosableDialogTitle grey handleClose={handleClose} />
      <DialogContent>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            pb: 3,
          }}
        >
          <h2> Welcome to Nucleoid Project </h2>
        </Box>
        <Box>
          Nucleoid framework lets you build your APIs with the help of AI and
          built-in datastore.
        </Box>
        <Box
          sx={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h2>How it works</h2>
          </Box>

          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <List
              sx={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
