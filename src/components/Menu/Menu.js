import Drawer from "@mui/material/Drawer";
import LgDrawerStyled from "../LgDrawerStyled";
import Logo from "../Logo";
import OpenSwaggerDialog from "../OpenSwaggerDialog";
import ProjectSelect from "../../components/ProjectSelect";
import ProjectSelectSmall from "../ProjectSelectSmall/ProjectSelectSmall";
import React from "react";
import Settings from "../Settings";
import SmallLogo from "../SmallLogo";
import Status from "../../widgets/Status";
import { drawerWidth } from "../../config";
import settings from "../../settings";
import styles from "./styles";
import { useEvent } from "../../hooks/useEvent";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { ArrowForwardIos, DensityMedium } from "@mui/icons-material/";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
} from "@mui/material";

const withFilter = (Component) => {
  const Wrapped = (props) => {
    const updatedProps = { title: "IDE", list: [] };
    if (!settings.plugin()) {
      updatedProps.list = props.list.filter(
        (item) => item.title !== "Dashboard"
      );
    } else {
      updatedProps.list = [...props.list];
    }
    return <Component {...updatedProps} />;
  };

  return Wrapped;
};

//TODO Split this page as components and styles
function Menu(props) {
  const [openMd, setOpenMd] = React.useState(false);
  const [openLg, setOpenLg] = React.useState(true);
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  const handleClose = () => {
    setOpenMd(false);
  };

  const MenuLinkWithFilter = () => withFilter(MenuLinks)(props);
  const SmallMenuLinkWithFilter = () => withFilter(SmallMenuLinks)(props);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1300 }}>
      {matchDownMD ? (
        <>
          {!openMd && (
            <Drawer
              variant="permanent"
              sx={{
                width: 75,
                "& .MuiDrawer-paper": {
                  width: 75,
                },
              }}
            >
              <List>
                <ListItem button onClick={() => setOpenMd(true)}>
                  <SmallLogo />
                </ListItem>
                <br />
                <SmallMenuLinkWithFilter />
              </List>
              <ProjectSelectSmall />
              <Box sx={{ height: "100%" }} />
              <OpenSwaggerDialog small />
              <Settings size={"large"} />
              <Button sx={{ pb: 3 }} onClick={() => setOpenMd(true)}>
                <ArrowForwardIos
                  fontSize="small"
                  sx={{ fill: theme.palette.custom.grey }}
                />
              </Button>
            </Drawer>
          )}
          <Drawer
            open={openMd}
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            variant="temporary"
            sx={{
              display: { xs: "block", lg: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRight: `1px solid ${theme.palette.divider}`,
                backgroundImage: "none",
                boxShadow: "inherit",
              },
            }}
          >
            <List>
              <ListItem>
                <Logo title={props.title} />
                <IconButton
                  variant={"contained"}
                  onClick={() => setOpenMd(false)}
                >
                  <DensityMedium
                    fontSize="medium"
                    sx={{ fill: theme.palette.custom.grey }}
                  />
                </IconButton>
              </ListItem>
              <br />
              <MenuLinkWithFilter />
            </List>
            <ProjectSelect />
            <Status />
            <OpenSwaggerDialog />
            <Settings size={"large"} />
          </Drawer>
        </>
      ) : (
        <>
          {!openLg && (
            <Drawer
              variant="permanent"
              sx={{
                width: 75,
                "& .MuiDrawer-paper": {
                  width: 75,
                },
              }}
            >
              <List>
                <ListItem button onClick={() => setOpenLg(true)}>
                  <SmallLogo />
                </ListItem>
                <br />
                <SmallMenuLinkWithFilter />
              </List>
              <ProjectSelectSmall />
              <Box sx={{ height: "100%" }} />
              <OpenSwaggerDialog small />
              <Settings size={"large"} />
              <Button sx={{ pb: 3 }} onClick={() => setOpenLg(true)}>
                <ArrowForwardIos
                  fontSize="small"
                  sx={{
                    fill: theme.palette.custom.grey,
                  }}
                />
              </Button>
            </Drawer>
          )}
          <LgDrawerStyled variant="permanent" open={openLg}>
            <List>
              <ListItem>
                <Logo title={props.title} />
                <IconButton
                  variant={"contained"}
                  onClick={() => setOpenLg(false)}
                >
                  <DensityMedium
                    fontSize="medium"
                    sx={{ fill: theme.palette.custom.grey }}
                  />
                </IconButton>
              </ListItem>
              <br />
              <MenuLinkWithFilter />
            </List>
            <ProjectSelect />
            <Status />
            <OpenSwaggerDialog />
            <Settings size={"large"} />
          </LgDrawerStyled>
        </>
      )}
    </Box>
  );
}

const MenuLinks = (props) => {
  const navigate = useNavigate();
  const [runtimeConnection] = useEvent("RUNTIME_CONNECTION", {
    status: false,
  });

  return (
    <>
      {props.list.map(({ title, link, anchor, icon }) => {
        return (
          <React.Fragment key={title}>
            <ListItem
              disabled={
                runtimeConnection.status === false &&
                (title === "Query" || title === "Logs")
              }
              sx={styles.listItem}
              onClick={() => navigate(link, { state: { anchor } })}
              button
            >
              <ListItemIcon sx={styles.listItemIcon}>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          </React.Fragment>
        );
      })}
    </>
  );
};

const SmallMenuLinks = (props) => {
  return (
    <>
      {props.list.map((item) => (
        <MenuItem {...item} />
      ))}
    </>
  );
};

const MenuItem = ({ title, link, anchor, icon }) => {
  const navigate = useNavigate();
  const [runtimeConnection] = useEvent("RUNTIME_CONNECTION", {
    status: false,
  });

  return (
    <ListItem
      disabled={
        runtimeConnection.status === false &&
        (title === "Query" || title === "Logs")
      }
      key={title}
      onClick={() => navigate(link, { state: { anchor } })}
      button
    >
      <Tooltip placement="right" title={title}>
        <Box sx={styles.listItemIconSmall}>{icon}</Box>
      </Tooltip>
    </ListItem>
  );
};

export default Menu;
